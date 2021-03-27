import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from '@mdi/react'
import airport from 'airport-codes'
import moment from 'moment'
import { mdiAirplane } from '@mdi/js'
import { Box } from '@material-ui/core'
import { Overlay, FlightActions, EditFlight, DeleteFlight } from '.'
import { grey } from '@material-ui/core/colors'

const cardHeight = 300
const cardWidth = 236

const styles = {
  overlay: {
    borderRadius: 10,
    background: 'rgba(0,0,0,0.1)',
    height: '100%',
  },
  overlayHidden: {
    transform: `scale(0.8) translateY(-${cardHeight * 1.2}px)`
  },
  overlayShown: {
    transform: `scale(1) translateY(-${cardHeight}px)`
  },
  card: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
    padding: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    height: cardHeight,
    width: cardWidth,
    position: 'relative',
  },
  airportCode: {
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'Anton',
    fontSize: 32
  },
  airportName: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: 12
  }
}

/**
* @augments {Component<{  item:object>}
*/
class FlightCard extends Component {

  state = {
    loading: false,
    success : false,
    hovered: false,
    editFlight : false,
    deleteFlight : false
  }

  render() {
    const { details } = this.props
    const { hovered, editFlight, deleteFlight } = this.state
    return (
      <div style={styles.container}
        onMouseOver={this.hover.bind(this)}
        onMouseLeave={this.unhover.bind(this)}
        onClick={this.setVote.bind(this)}
      >
        <Box style={styles.card}>
          {this.renderFlight(details)}
          {this.renderActions()}
        </Box>
        <Overlay show={hovered} style={styles.overlay} styleShown={styles.overlayShown} styleHidden={styles.overlayHidden} />
        { deleteFlight && 
          <DeleteFlight 
            open={deleteFlight} 
            onClose={() => this.setState({ deleteFlight: false })}
            okMessage="Proceed"
            cancelMessage="Cancel"
            message="Are you sure you want to delete this flight?"
            title="Delete Flight"
            id={details.id}
             />
        }
        { editFlight && <EditFlight open={editFlight} onClose={() => this.setState({ editFlight: false })} 
          details={details}/>
        }
      </div>
    )
  }

  setVote(){
    const { details } = this.props
    this.props.onClick(details)
  }

  renderFlight(details) {
    return (

        <div style={{ height: '97%', width: '97%', borderRadius: 8, backgroundColor: grey[200] }}>
          <div style={{ height: '45%', fontFamily: 'Open Sans Condensed', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 120 }}>
            {details.current}
          </div>
          <div style={{ height: '10%', display: 'flex', justifyContent: 'center' }}>
            {moment(details.date).format("LL")}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ flex: 2 }}>
              <div style={styles.airportCode}>
                {details.origin}
              </div>
              <div style={styles.airportName}>
                {this.formatAirport(airport.findWhere({ iata: details.origin }).get('name'))}
              </div>
            </div>
            <Icon
              style={{ flex: 1 }}
              path={mdiAirplane}
              rotate={90}
              size={2}
            />
            <div style={{ flex: 2 }}>
              <div style={styles.airportCode}>
                {details.destination}
              </div>
              <div style={styles.airportName}>{
                this.formatAirport(airport.findWhere({ iata: details.destination }).get('name'))}
              </div>
            </div>
          </div>
        </div>
    )
  }

  renderActions() {
    const { details } = this.props
    const { hovered } = this.state
    return <FlightActions hovered={hovered} triggerEdit={() => this.setState({ editFlight : true })} 
      setDetail={() => this.setState({detail:details})} triggerDelete={() => this.setState({ deleteFlight:true })} />
  }

  formatAirport(airport) {
    return airport.replace(/\b(\w*Intl\w*)\b/g, "")
      .replace(/\b(\w*Airport\w*)\b/g, "")

  }

  hover() {
    this.setState({ hovered: true })
  }

  unhover() {
    this.setState({ hovered: false })
  }
}

FlightCard.propTypes = {
  item: PropTypes.object
}

export default FlightCard