import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@material-ui/core'

const styles = {
  overlay: {
    background: 'rgba(0,0,0,0.5)',
    transition: 'all 0.15s ease-in-out 0s'
  }
}

const Overlay = (props) => {
  return (renderBox(props));
}

const renderBox = (props) => {
  return <Box style={{ ...styles.overlay, ...props.style, ...props.styleShown, opacity: props.show ? 1 : 0 }} >
    </Box>
}

const editFlight = (props) => {
  // props.editFlight = true;
  console.log(props);
  // this.setProps({ editFlight : true })
}

Overlay.propTypes = {
  show: PropTypes.bool,
  style: PropTypes.object,
  styleShown: PropTypes.object,
  styleHidden: PropTypes.object
}

export default Overlay