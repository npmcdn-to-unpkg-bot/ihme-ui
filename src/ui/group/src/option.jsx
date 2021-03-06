import React, { PropTypes } from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { CommonPropTypes, PureComponent, propsChanged, stateFromPropUpdates } from '../../../utils';

import Button from '../../button';
import styles from './group.css';

export default class Option extends PureComponent {
  static calculateStyle(props) {
    return {
      ...props.style,
      ...(props.selected ? props.selectedStyle : {}),
      ...(props.disabled ? props.disabledStyle : {}),
    };
  }

  constructor(props) {
    super(props);

    this.state = stateFromPropUpdates(Option.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Option.propUpdates, this.props, nextProps, {}));
  }

  render() {
    const {
      className,
      disabled,
      disabledClassName,
      selected,
      selectedClassName,
      type,
    } = this.props;
    const {
      style,
    } = this.state;

    return React.createElement(
      type,
      {
        className: classNames(className, {
          [selectedClassName]: selected,
          [disabledClassName]: disabled,
        }),
        disabled,
        selected,
        style,
        ...omit(this.props, Object.keys(Option.propTypes)),
      }
    );
  }
}

Option.propTypes = {
  className: CommonPropTypes.className,

  /* apply disabled class styling */
  disabled: PropTypes.bool,
  disabledClassName: CommonPropTypes.className,
  disabledStyle: CommonPropTypes.style,

  /* apply selected class styling */
  selected: PropTypes.bool,
  selectedClassName: CommonPropTypes.className,
  selectedStyle: CommonPropTypes.style,

  style: CommonPropTypes.style,

  /* react element to be wrapped by this option */
  type: PropTypes.any,
};

Option.defaultProps = {
  disabledClassName: styles.disabled,
  selectedClassName: styles.selected,
  type: Button,
};

Option.propUpdates = {
  style: (state, propName, prevProps, nextProps) => {
    if (propsChanged(prevProps, nextProps, ['style', 'selected', 'disabled'])) {
      return { ...state, style: Option.calculateStyle(nextProps) };
    }
    return state;
  },
};
