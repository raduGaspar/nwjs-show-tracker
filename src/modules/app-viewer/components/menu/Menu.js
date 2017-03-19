import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  menu: state.menu,
  globals: state.globals,
});

const Menu = (props) => {
  const { visible } = props.menu;
  const { win } = props.globals;
  const menuContent = (
    <div className="main-menu">
      <button
        className="close"
        onClick={() => win.close(true)}
      />
      <button
        className="minimize"
        onClick={() => win.minimize()}
      />
      <button
        className="fullscreen"
        onClick={() => win.toggleFullscreen()}
      />
    </div>
  );

  return visible ? menuContent : null;
};

Menu.propTypes = {
  visible: React.PropTypes.bool,
};

export default connect(
  mapStateToProps
)(Menu);
