import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withFirebase } from '../../firebase'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core'


/**
* @augments {Component<{  item:object>}
*/
class DeleteFlight extends Component {
    state = {
      loading : false,
      success : false
    }
    render(){
        const { id, open, message, title, okMessage, cancelMessage } = this.props
        return (
            <Dialog
              disableBackdropClick
              disableEscapeKeyDown
              maxWidth={false}
              onClose={this.handleClose.bind(this)}
              aria-labelledby="confirmation-dialog-title"
              open={open}
            >
              <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
              <DialogContent dividers>
                {message}
              </DialogContent>
              <DialogActions>
                <Button onClick={ this.handleClose.bind(this) } color="primary">
                  {cancelMessage}
                </Button>
                <Button onClick={() => this.deleteFlight(id) } color="primary">
                  {okMessage}
                </Button>
              </DialogActions>
            </Dialog>
          );
    }

    handleClose(){
        this.props.onClose()
    }


    async deleteFlight(id){
      if (!this.state.success) {
        this.setState({ loading: true })
        const flightsRef = this.props.firebase.flights()
        const flightRef = await flightsRef.doc(id)

        await flightRef.delete()

        this.setState({ loading: false, success: true })
        this.props.onClose()
      }
    }

}

const mapStateToProps = (state) => ({
    userId: state.auth.user.uid
  })
  
export default connect(
    mapStateToProps
)(withFirebase(DeleteFlight))