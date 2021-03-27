import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from '@mdi/react'
import { mdiPencil, mdiDelete } from '@mdi/js'
import { createMuiTheme, Fab } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import { COLORS } from '../../constants'

const customPostTheme = createMuiTheme({
    palette: {
      primary: {
        main: COLORS.green
      },
      secondary: {
        main: COLORS.secondary
      },
    },
  })


class FlightActions extends Component {
    render() {
        const { hovered } = this.props
        return (
            <ThemeProvider theme={customPostTheme}>
                <div style={{ position: 'absolute', bottom: 10, justifyContent: 'space-between', width: '90%' }}>
                    <Fab style={hovered ? { height: 40, width: 40, margin: '2px 2px', float: 'right', zIndex: 100 } : { display : 'none' }} 
                        color={'secondary'} onClick={this.deleteDetail.bind(this)}>
                        <Icon path={ mdiDelete } size={1} />
                    </Fab>
                    <Fab style={hovered ? { height: 40, width: 40, margin: '2px 2px', float: 'right', zIndex: 100 } : { display : 'none' }} 
                        color={'primary'} onClick={this.editDetail.bind(this)}>
                        <Icon path={ mdiPencil } size={1} />
                    </Fab>
                </div>
            </ThemeProvider>
        )
    }

    editDetail() {
        this.props.setDetail()
        this.props.triggerEdit()
    }

    deleteDetail() {
        this.props.setDetail()
        this.props.triggerDelete()
    }
}

FlightActions.propTypes = {
    item: PropTypes.object
}
  
export default FlightActions