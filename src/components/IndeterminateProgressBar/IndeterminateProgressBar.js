import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  root: {
    backgroundColor: '#E5E6E7',
    width: '200px',
  },
  barColorPrimary: {
    backgroundColor: '#4FC1E9',
  },
};

function IndeterminateProgressBar(props) {
  const { classes } = props;
  return (
    <LinearProgress
      classes={{
        root: classes.root,
        barColorPrimary: classes.barColorPrimary,
      }}
    />
  );
}

IndeterminateProgressBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IndeterminateProgressBar);
