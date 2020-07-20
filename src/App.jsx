// const element = (
//     <div title="Outer div">
//         <h1>Hello World</h1>
//     </div>
// )

// ReactDOM.render(element, document.getElementById('contents'))


// const element = React.createElement('div', { title: 'Outer div' },
//     React.createElement('h1', null, 'Hello World'))

const continents = ['Africa', 'America', 'Asia', 'Australia', 'Europe', 'India', 'Cannada'];
const helloContinents = Array.from(continents, c => `Hello ${c}!`);
const message = helloContinents.join(' ');
const element = (
    <div title="Outer div">
        <h1>{message}</h1>
    </div>
);

ReactDOM.render(element, document.getElementById('contents'));