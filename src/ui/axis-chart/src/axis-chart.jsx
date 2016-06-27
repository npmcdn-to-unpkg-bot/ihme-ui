import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';
import { CommonPropTypes, getScale, getScaleTypes, propsChanged } from '../../../utils';

const SCALE_TYPES = getScaleTypes();

export function calcChartDimensions(width, height, padding) {
  return {
    width: width - (padding.left + padding.right),
    height: height - (padding.top + padding.bottom),
  };
}

export default class AxisChart extends React.Component {
  constructor(props) {
    super(props);
    const chartDimensions = calcChartDimensions(props.width, props.height, props.padding);
    this.state = {
      chartDimensions,
      scales: {
        x: getScale(props.xScaleType)().domain(props.xDomain).range([0, chartDimensions.width]),
        y: getScale(props.yScaleType)().domain(props.yDomain).range([chartDimensions.height, 0]),
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const state = {};

    if (propsChanged(this.props, nextProps, ['width', 'height', 'padding'])) {
      state.chartDimensions = calcChartDimensions(nextProps.width,
                                                  nextProps.height,
                                                  nextProps.padding);
    }

    /* eslint-disable no-cond-assign */
    let xChanged;
    let yChanged;
    if ((xChanged = (state.chartDimensions ||
                     propsChanged(this.props, nextProps, ['xScaleType', 'xDomain']))) ||
        (yChanged = (state.chartDimensions ||
                     propsChanged(this.props, nextProps, ['yScaleType', 'yDomain'])))) {
      const chartDimensions = state.chartDimensions || this.state.chartDimensions;
      state.scales = {
        x: xChanged ?
          getScale(nextProps.xScaleType)().domain(nextProps.xDomain)
            .range([0, chartDimensions.width]) :
          this.state.scales.x,
        y: yChanged ?
          getScale(nextProps.yScaleType)().domain(nextProps.yDomain)
            .range([chartDimensions.height, 0]) :
          this.state.scales.y,
      };
    }
    /* eslint-enable no-cond-assign */

    this.setState(state);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return PureRenderMixin.shouldComponentUpdate(this, nextProps, nextState);
  }

  render() {
    const { props } = this;
    const { chartDimensions, scales } = this.state;

    return (
      <svg
        width={`${chartDimensions.width + props.padding.left + props.padding.right}px`}
        height={`${chartDimensions.height + props.padding.bottom + props.padding.top}px`}
        className={classNames(props.className)}
      >
        <g transform={`translate(${props.padding.left}, ${props.padding.top})`}>
           {
             React.Children.map(props.children, (child) => {
               return child && React.cloneElement(child, {
                 scales,
                 padding: props.padding,
                 ...chartDimensions,
               });
             })
           }
        </g>
      </svg>
    );
  }
}

AxisChart.propTypes = {
  /* class names to appended to the element */
  className: CommonPropTypes.className,

  /* [min, max] for xScale (i.e., the domain of the data) */
  xDomain: PropTypes.array,

  /* type of scale */
  xScaleType: PropTypes.oneOf(SCALE_TYPES),

  /* [min, max] yScale (i.e., the range of the data) */
  yDomain: PropTypes.array,

  /* type of scale */
  yScaleType: PropTypes.oneOf(SCALE_TYPES),

  /* px width of line chart */
  width: PropTypes.number,

  /* px height of line chart */
  height: PropTypes.number,

  /* padding around the chart contents, space for Axis and Label */
  padding: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.number,
    left: PropTypes.number,
  }),

  children: PropTypes.node,
};

AxisChart.defaultProps = {
  padding: {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50,
  },
};
