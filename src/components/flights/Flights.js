import React, { Component } from 'react'
import { firestore } from 'firebase/app'
import { connect } from 'react-redux'
import { withAuthorization } from '../../session'
import { withFirebase } from '../../firebase'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { Icon } from '@mdi/react'
import { mdiPlus } from '@mdi/js'
import { Main } from '../'
import { FlightCard, AddFlight } from '.'
import airport from 'airport-codes'

class Flights extends Component {

  actions = [
    {
      icon: <Icon path={mdiPlus} size={1} />,
      onClick: () => this.setState({ openFlight: true }),
      color: 'primary'
    }
  ]

  state = {
    loading: false,
    flights: null,
    openFlight: false,
    keyForUpdate : 0,
    searchString : null,
  }

  componentDidMount() {
    // This sorting is done on back end request, shifting to front end sorting
    // const flightsRef = this.props.firebase.flights().orderBy("current", "desc") 
    const flightsRef = this.props.firebase.flights()
    flightsRef.onSnapshot(snapshot => this.setState({ flights: snapshot.docs, loading: false }))
  }

  render() {
    const { flights, openFlight } = this.state
    return (
      <Main actions={this.actions} setSearch={(searchString) => this.startSearch(searchString)}>
        {this.renderFlightCards(flights)}
        <AddFlight open={openFlight} onClose={() => this.setState({ openFlight: false })} />
      </Main>
    )
  }

  /**  I resorted to apply sorting in the front end instead of back end
  * Also applied here filtering of results based on search value, drawback: possibly UI may become slower when data becomes larger:
  *   so it is still better to filter them through back end, not through UI
  *  
  */
  renderFlightCards(flights) {
    if (flights) {
      return flights.map((flight) => {
        let flightData = {
          id : flight.id,
          current : flight.data().current,
          origin : flight.data().origin,
          destination : flight.data().destination,
          date: flight.data().date,
          orgCountry : this.getCountry(flight.data().origin),
          orgAirport : this.getAirport(flight.data().origin),
          destCountry : this.getCountry(flight.data().destination),
          destAirport : this.getAirport(flight.data().destination)
        }
        return flightData
      })
      .sort((a,b) => {
        return b.current - a.current
      })
      .filter(flight => {
        let queryString = this.state.searchString
        if(!queryString)
          return true
        
        return this.compareString(queryString, flight.origin) || this.compareString(queryString, flight.destination)
                || this.compareString(queryString, flight.orgCountry) || this.compareString(queryString, flight.orgAirport)
                || this.compareString(queryString, flight.destCountry) || this.compareString(queryString, flight.destAirport);
      })
      .map(flight => {
        return <FlightCard details={flight} onClick={(flight) => this.setVote(flight)} />
      })
    }
  }

  compareString(query, source){
    return source.toLowerCase().includes(query.toLowerCase());
  }

  startSearch(searchString){
    this.setState({ searchString : searchString, loading : true });
  }


  getCountry(iata) {
    return airport.findWhere({ iata: iata }).get('country')
  }

  getAirport(iata){
    return airport.findWhere({ iata: iata }).get('name')
  }

  async setVote(flight){
    this.setState({ loading: true })
    const flightsRef = this.props.firebase.flights()
    const flightRef = await flightsRef.doc(flight.id)
    const flightData = await flightRef.get();

    if(!flightData.data().voters.includes(this.props.userId)){
      await flightRef.update({
        current : flight.current + 1,
        voters: firestore.FieldValue.arrayUnion(this.props.userId)
      })
    }

    this.setState({ loading: false })
  }
}

const condition = authUser => !!authUser;
const mapStateToProps = (state) => ({
  userId: state.auth.user.uid
})


export default compose(
  withRouter,
  withFirebase,
  withAuthorization(condition),
  connect(mapStateToProps)
)(Flights)