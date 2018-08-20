import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  root: {
    backgroundColor: '#E5E6E7',
    width: '200px',
  },
  rootRed: {
    backgroundColor: '#DB6955',
    width: '200px',
  },
  barColorPrimary: {
    backgroundColor: '#4FC1E9',
  },
  barColorEmpty: {
    backgroundColor: '#E5E6E7',
  },
  barColorRed: {
    backgroundColor: '#DB6955',
  },
};

const barColor = (paused, error, classes) => {
  if (paused) {
    return classes.barColorEmpty;
  }
  if (error) {
    return classes.barColorRed;
  }
  return classes.barColorPrimary;
};

const IndeterminateProgressBar = ({ paused, error, classes }) => (
  <LinearProgress
    classes={{
      root: error ? classes.rootRed : classes.root,
      barColorPrimary: barColor(paused, error, classes),
    }}
  />
);

IndeterminateProgressBar.propTypes = {
  paused: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IndeterminateProgressBar);
