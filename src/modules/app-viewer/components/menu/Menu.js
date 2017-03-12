import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  menu: state.menu,
});

const Menu = (props) => {
  const { visible } = props.menu;
  const noMenu = <p>menu is hidden :(</p>;
  const menuContent = (
    <ul className="main-menu">
      <li>Dummy</li>
      <li>Menu</li>
      <li>...fabulous</li>
    </ul>
  );

  return visible ? menuContent : noMenu;
};

Menu.propTypes = {
  visible: React.PropTypes.bool,
};

export default connect(
  mapStateToProps
)(Menu);
