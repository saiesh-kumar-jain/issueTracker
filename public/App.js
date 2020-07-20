"use strict";

// const element = (
//     <div title="Outer div">
//         <h1>Hello World</h1>
//     </div>
// )
// ReactDOM.render(element, document.getElementById('contents'))
// const element = React.createElement('div', { title: 'Outer div' },
//     React.createElement('h1', null, 'Hello World'))
var continents = ['Africa', 'America', 'Asia', 'Australia', 'Europe', 'India', 'Cannada'];
var helloContinents = Array.from(continents, function (c) {
  return "Hello ".concat(c, "!");
});
var message = helloContinents.join(' ');
var element = /*#__PURE__*/React.createElement("div", {
  title: "Outer div"
}, /*#__PURE__*/React.createElement("h1", null, message));
ReactDOM.render(element, document.getElementById('contents'));