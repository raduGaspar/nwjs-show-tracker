import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  menu: state.menu,
  globals: state.globals,
});

const Menu = (props) => {
  const { visible } = props.menu;
  const { win } = props.globals;
  const noMenu = <p>menu is hidden :(</p>;
  const menuContent = (
    <div className="main-menu">
      <button onClick={() => win.close(true)}>
        Close
      </button>
      <button onClick={() => win.toggleFullscreen()}>
        Fullscreen
      </button>
      <button disabled>Minimize</button>
    </div>
  );

  return visible ? menuContent : noMenu;
};

Menu.propTypes = {
  visible: React.PropTypes.bool,
};

export default connect(
  mapStateToProps
)(Menu);
