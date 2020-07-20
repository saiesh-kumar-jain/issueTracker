class IssueFilter extends React.Component {
    render() {
        return (
            <div><h1>Issue Filter</h1></div>
        );
    }
}

class IssueTable extends React.Component {
    render() {
        return (
            <div> Issue Table </div>
        );
    }
}

class IssueAdd extends React.Component {
    render() {
        return (
            <div>This is a placeholder for a form to add an issue.</div>
        );
    }
}

class IssueList extends React.Component {
    render() {
        return (
            <React.Fragment>
                <h1>Issue Tracker</h1>
                <IssueFilter />
                <hr />
                <IssueTable />
                <hr />
                <IssueAdd />
            </React.Fragment>
        );
    }
}

const element = < IssueList />

ReactDOM.render(element, document.getElementById('contents'));