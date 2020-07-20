
const sampleIssue = {
    status: 'New', owner: 'Pieta',
    title: 'Completion date should be optional',
};


class IssueFilter extends React.Component {
    render() {
        return (
            <div><h1>Issue Filter</h1></div>
        );
    }
}

// class IssueTable extends React.Component {
//     render() {
//         const rowStyle = { border: "1px solid silver", padding: 4 };
//         return (
//             <table style={{ borderCollapse: "collapse" }}>
//                 <thead>
//                     <tr>
//                         <th style={rowStyle}>ID</th>
//                         <th style={rowStyle}>Title</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <IssueRow rowStyle={rowStyle} issue_id={1}>
//                         Error in console when clicking Add
//                     </IssueRow>
//                     <IssueRow rowStyle={rowStyle} issue_id={2}>
//                         <div>Missing <b>bottom</b> border on panel</div>
//                     </IssueRow>
//                 </tbody>
//             </table>
//         );
//     }
// }

function IssueTable(props) {
    const issueRows = props.issues.map(issue => <IssueRow key={issue.id} issue={issue} />);
    return (
        <table className="bordered-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Created</th>
                    <th>Effort</th>
                    <th>Due Date</th>
                    <th>Title</th>
                </tr>
            </thead>
            <tbody>
                {issueRows}
            </tbody>
        </table>
    );
}

// class IssueRow extends React.Component {
//     render() {
//         const style = this.props.rowStyle;
//         return (
//             <tr>
//                 <td style={style}>{this.props.issue_id}</td>
//                 <td style={style}>{this.props.children}</td>
//             </tr>
//         );
//     }
// }

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
    if (dateRegex.test(value))
        return new Date(value);
    return value;
}

function IssueRow(props) {
    const issue = props.issue;
    return (
        <tr>
            <td>{issue.id}</td>
            <td>{issue.status}</td>
            <td>{issue.owner}</td>
            <td>{issue.created.toDateString()}</td>
            <td>{issue.effort}</td>
            <td>{issue.due ? issue.due.toDateString() : ' '}</td>
            <td>{issue.title}</td>
        </tr>
    );
}

class IssueAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.issueAdd;
        const issue = {
            owner: form.owner.value, title: form.title.value,
            due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
        }
        this.props.createIssue(issue);
        form.owner.value = ""; form.title.value = "";
    }

    render() {
        return (
            <form name="issueAdd" onSubmit={this.handleSubmit}>
                <input type="text" name="owner" placeholder="Owner" />
                <input type="text" name="title" placeholder="Title" />
                <button>Add</button>
            </form>
        );
    }
}

async function graphQLFetch(query, variables = {}) {
    try {
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });
        const body = await response.text();
        const result = JSON.parse(body, jsonDateReviver);
        if (result.errors) {
            const error = result.errors[0];
            if (error.extensions.code == 'BAD_USER_INPUT') {
                const details = error.extensions.exception.errors.join('\n ');
                alert(`${error.message}:\n ${details}`);
            } else {
                alert(`${error.extensions.code}: ${error.message}`);
            }
        }
        return result.data;
    } catch (e) {
        alert(`Error in sending data to server: ${e.message}`);
    }
}

class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] }
        this.createIssue = this.createIssue.bind(this);
    }

    async createIssue(issue) {
        // issue.id = this.state.issues.length + 1;
        // issue.created = new Date();
        // const newIssueList = this.state.issues.slice();
        // newIssueList.push(issue);
        // this.setState({ issues: newIssueList });
        // const query = `mutation {
        //     issueAdd(issue:{
        //         title: "${issue.title}",
        //         owner: "${issue.owner}",
        //         due: "${issue.due.toISOString()}",
        //         }) {
        //         id
        //         }
        //     }`;
        const query = `mutation issueAdd($issue: IssueInputs!) {
            issueAdd(issue: $issue) {
            id
          }
        }`;
        // const response = await fetch('/graphql', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ query, variables: { issue } })
        // });
        // this.loadData();
        const data = await graphQLFetch(query, { issue });
        if (data) {
            this.loadData();
        }
    }

    componentDidMount() {
        this.loadData()
    }

    async loadData() {
        const query = `query {
            issueList {
            id title status owner
            created effort due
            }
            }`;
        // const response = await fetch('/graphql', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ query })
        // });
        // //const result = await response.json();
        // const body = await response.text();
        // const result = JSON.parse(body, jsonDateReviver);
        // this.setState({ issues: result.data.issueList });
        const data = await graphQLFetch(query);
        if (data) {
            this.setState({ issues: data.issueList });
        }
    }
    render() {
        return (
            <React.Fragment>
                <h1>Issue Tracker</h1>
                <IssueFilter />
                <hr />
                <IssueTable issues={this.state.issues} />
                <hr />
                <IssueAdd createIssue={this.createIssue} />
            </React.Fragment>
        );
    }
}

const element = < IssueList />

ReactDOM.render(element, document.getElementById('contents'));