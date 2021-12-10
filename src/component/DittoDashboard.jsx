import React, { Component } from 'react'
import interviewsJson from './interviews.json';
import TimeAgo from 'react-timeago';

export default class DittoDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            interviewsJson: interviewsJson,
            filterDropdown: [],
            listItems: [],
            search: '',
            status: '',
            archived: false
        }
        this.processForUI = this.processForUI.bind(this);
        this.filterInterviews = this.filterInterviews.bind(this);
        this.letsFilterData = this.letsFilterData.bind(this);
    }

    componentWillMount = () => {
        this.processForUI(interviewsJson, true);
    }

    processForUI = (intObj, createDropdown = false) => {
        let filterDropdown = [];
        const listItems = intObj.map((item) => {

            if (createDropdown) {
                if (!filterDropdown.includes(item.status)) {
                    filterDropdown.push(item.status);
                }
            }
            return (
                <ul className={`int-list-items ${item.last_comms.unread ? 'bolder' : ''}`}>
                    <li className="col-1 col-candidate">
                        <div className="col-1">
                            <img className="rounded" src={item.image} />
                        </div>
                        <div className="">
                            {item.candidate}
                        </div>
                    </li>
                    <li className="col-2">{item.role}</li>
                    <li className="col-3">{item.last_comms.description}
                        <TimeAgo style={{ "marginLeft": "5px" }} date={item.last_comms.date_time} /></li>
                    <li className="col-4 col-salary">R {item.salary}</li>
                    <li className="col-5">{item.sent_by}</li>
                    <li className="col-6">{item.archived}
                        <span className={`${item.archived ? 'archived' : 'active'}`}>
                            {item.archived ? 'Archived' : 'Active'}
                        </span>
                    </li>
                    <li className="col-7">{item.sent_by}</li>
                </ul>
            )
        });

        this.setState({ interviewsJson: intObj, listItems: listItems }, () => {
            if (createDropdown) {
                this.setState({ filterDropdown: filterDropdown.map(item => { return <option value={item}>{item}</option> }) });
            }
        });
    }

    filterInterviews = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, () => this.letsFilterData());

    }

    letsFilterData = () => {
        let filteredJson = interviewsJson;
        if (this.state.search.length > 3) {
            filteredJson = filteredJson.filter(item => (item.candidate.toLowerCase()).indexOf(this.state.search.toLowerCase()) != -1);
        }

        if (this.state.status.length) {
            filteredJson = filteredJson.filter(item => (item.status.toLowerCase()).indexOf(this.state.status.toLowerCase()) != -1);
        }

        if (this.state.archived) {
            filteredJson = filteredJson.filter(item => (item.archived === true));
        }
        this.processForUI(filteredJson);
    }

    render() {
        return (
            <>
                <header className="header">
                    <div className="flex" style={{ "paddingTop": "26px", "marginLeft": "16px" }}>
                        <a href="/" class="">
                            <span class="text-blue-1">Ditto</span>
                        </a>
                        <div style={{ "marginLeft": "16px" }}>
                            <input className="search-input" type="search" value={this.state.search} name="search" placeholder="Search" aria-label="Search"
                                onChange={this.filterInterviews}
                            />
                        </div>
                    </div>
                </header>
                <main class="container">
                    <div className="flex">
                        <div class="col-heading1">
                            <h1 class="">Interview Requests</h1>
                            <p class="bolder text-blue-6">There are {this.state.listItems.length} candidates in the list.</p>
                        </div>
                        <div className="col-heading2">
                            <div className="flex">
                                <select name="status" className="" aria-label="Filter By Status"
                                    onChange={this.filterInterviews}>
                                    <option value="" selected>Filter By Status</option>
                                    {this.state.filterDropdown}
                                </select>

                                <div style={{ "marginLeft": "16px" }}>
                                    <div>
                                        <input class="" type="checkbox" name="archived" role="switch" id="archived"
                                            checked={this.state.archived}
                                            onChange={this.filterInterviews}
                                        />
                                        <label class="" for="archived">Show Archived</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="int-list-container">
                        <ul className="int-list-head">
                            <li className="col-1">Candidate</li>
                            <li className="col-2">Role</li>
                            <li className="col-3">Last Communication</li>
                            <li className="col-4">Salary</li>
                            <li className="col-5">Send By</li>
                            <li className="col-6"></li>
                            <li className="col-7"></li>
                        </ul>
                        {this.state.listItems.length ? this.state.listItems : <ul><li>No Record Found.</li></ul>}
                    </div>
                </main>
            </>
        )
    }
}
