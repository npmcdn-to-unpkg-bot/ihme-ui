import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { scaleLinear } from 'd3-scale';
import { map, omit } from 'lodash';

import Line from './line';
import Area from './area';
import { PureComponent, CommonPropTypes } from '../../../utils';

class MultiLine extends PureComponent {
  render() {
    const {
      areaClassName,
      colorScale,
      data,
      dataAccessors,
      dataField,
      keyField,
      lineClassName,
    } = this.props;

    const resolvedAreaClassName = classNames(areaClassName) || (void 0);
    const resolvedLineClassName = classNames(lineClassName) || (void 0);

    const childProps = omit(this.props, [
      'areaClassName',
      'data',
      'dataField',
      'keyField',
      'lineClassName',
      'style',
    ]);

    return (
      <g>
        {
          (!(dataAccessors.y || (dataAccessors.y0 && dataAccessors.y1))) ?
            null :
            map(data, (lineData) => {
              const key = lineData[keyField];
              const values = lineData[dataField];
              const color = colorScale(lineData[keyField]);
              // on each iteration, lineData is an object
              // e.g., { keyField: STRING, dataField: ARRAY }

              return (
                [(
                  <Area
                    className={resolvedAreaClassName}
                    color={color}
                    data={values}
                    key={`area:${key}`}
                    {...childProps}
                  />
                ), (
                  <Line
                    className={resolvedLineClassName}
                    stroke={color}
                    data={values}
                    key={`line:${key}`}
                    {...childProps}
                  />
                )]
              );
            })
        }
      </g>
    );
  }
}

MultiLine.propTypes = {
  /* base classname to apply to Areas that are children of MultiLine */
  areaClassName: CommonPropTypes.className,

  /* fn that accepts keyfield, and returns stroke color for line */
  colorScale: PropTypes.func,

  /* array of objects
    e.g. [ {location: 'USA',values: []}, {location: 'Canada', values: []} ]
  */
  data: PropTypes.arrayOf(PropTypes.object),

  /*
    key names containing x, y data
      x -> accessor for xscale
      y -> accessor for yscale (when there's one, e.g. <Line />)
      y0 -> accessor for yscale (when there're two; e.g., lower bound)
      y1 -> accessor for yscale (when there're two; e.g., upper bound)

    To show only a line, include just x, y.
    To show only an area, include just x, y0, y1.
    To show line and area, include all properties.
  */
  dataAccessors: PropTypes.oneOfType([
    PropTypes.shape({
      x: CommonPropTypes.dataAccessor.isRequired,
      y: CommonPropTypes.dataAccessor.isRequired,
    }),
    PropTypes.shape({
      x: CommonPropTypes.dataAccessor.isRequired,
      y0: CommonPropTypes.dataAccessor.isRequired,
      y1: CommonPropTypes.dataAccessor.isRequired,
    }),
    PropTypes.shape({
      x: CommonPropTypes.dataAccessor.isRequired,
      y: CommonPropTypes.dataAccessor.isRequired,
      y0: CommonPropTypes.dataAccessor.isRequired,
      y1: CommonPropTypes.dataAccessor.isRequired,
    }),
  ]).isRequired,

  /* key that holds values to be represented by individual lines */
  dataField: PropTypes.string,

  /* key that uniquely identifies dataset within array of datasets */
  keyField: PropTypes.string,

  /* base classname to apply to Lines that are children of MultiLine */
  lineClassName: CommonPropTypes.className,

  /* signature: function(event, line data, Line instance) {...} */
  onClick: PropTypes.func,

  /* signature: function(event, line data, Line instance) {...} */
  onMouseLeave: PropTypes.func,

  /* signature: function(event, line data, Line instance) {...} */
  onMouseMove: PropTypes.func,

  /* signature: function(event, line data, Line instance) {...} */
  onMouseOver: PropTypes.func,

  /* scales from d3Scale */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,
};

MultiLine.defaultProps = {
  showUncertainty: false,
  showLine: true,
  colorScale: () => 'steelblue',
  scales: { x: scaleLinear(), y: scaleLinear() },
};

export default MultiLine;
