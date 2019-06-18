import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { BRAND_COLOR } from '@superset-ui/color';
import { smartDateVerboseFormatter } from '@superset-ui/time-format';
import { computeMaxFontSize } from '@superset-ui/dimension';
import ImageAsset from '@switchdin-superset/switchdin-superset-image-assets';

import './BigNumberImage.css';

const PROPORTION = {
  HEADER: 0.4,
  SUBHEADER: 0.1,
  IMAGE: 1,
};

export function renderTooltipFactory(formatValue) {
  return function renderTooltip({ datum }) {
    // eslint-disable-line
    const { x: rawDate, y: rawValue } = datum;
    const formattedDate = smartDateVerboseFormatter(rawDate);
    const value = formatValue(rawValue);

    return (
      <div style={{ padding: '4px 8px' }}>
        {formattedDate}
        <br />
        <strong>{value}</strong>
      </div>
    );
  };
}

function identity(x) {
  return x;
}

class BigNumberImageVis extends React.PureComponent {
  constructor(props) {
    super(props);
    this.gradientId = shortid.generate();
  }

  getClassName() {
    const { className } = this.props;
    const names = `big_number ${className}`;
    return `${names}`;
  }

  createTemporaryContainer() {
    const container = document.createElement('div');
    container.className = this.getClassName();
    container.style.position = 'absolute'; // so it won't disrupt page layout
    container.style.opacity = 0; // and not visible
    return container;
  }

  renderHeader(maxHeight) {
    const { bigNumber, formatBigNumber, width } = this.props;
    const text = formatBigNumber(bigNumber);

    const container = this.createTemporaryContainer();
    document.body.appendChild(container);
    const fontSize = computeMaxFontSize({
      text,
      maxWidth: 0.6 * Math.floor(width),
      maxHeight,
      className: 'header_line',
      container,
    });

    const fontStyles = {
      fontSize: fontSize,
      marginTop: Math.floor(0.3 * fontSize),
    }

    document.body.removeChild(container);
    return (
      <div className="header_line" style={fontStyles} >
        {text}
      </div>
    );
  }

  renderSubheader(maxHeight) {
    const { subheader, width } = this.props;
    let fontSize = 0;
    if (subheader) {
      const container = this.createTemporaryContainer();
      document.body.appendChild(container);
      fontSize = computeMaxFontSize({
        text: subheader,
        maxWidth: 0.6 * Math.floor(width),
        maxHeight,
        className: 'subheader_line',
        container,
      });
      document.body.removeChild(container);
    }

    return (
      <div className="subheader_line" style={{ fontSize }} >
        {subheader}
      </div>
    );
  }

  render() {
    const { height, width,  bigNumber, formatBigNumber, subheader } = this.props;
    const className = this.getClassName();
    const text = formatBigNumber(bigNumber);
    return (
      <div className={className}>
        <div className="text_container row">
          <div className="col-sm-4 image_asset_container">
            <ImageAsset name={this.props.imageFile} width="100%" height="80%"/>
          </div>
          <div className="col-sm-8 text_subcontainer">
            <div className="col-sm-12 header_line text_subcontainer">
              {this.renderHeader(Math.ceil(PROPORTION.HEADER * height))}
            </div>
            <div className="col-sm-12 subheader_line text_subcontainer">
               {this.renderSubheader(Math.ceil(PROPORTION.SUBHEADER * height))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BigNumberImageVis;
