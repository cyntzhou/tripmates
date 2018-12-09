import React from "react";
import axios from "axios";
import { reverse, sortBy, uniq } from "lodash";
import styles from "./activities.css";
import ActivityItem from "./activity-item.jsx";
import AddButton from "../components/add-button.jsx";


class Activities extends React.Component {
  constructor() {
    super()
    this.state = {
      showCategoriesSelection: false,
      checkedCategories: [],
      sortedBy: "leastRecent"
    }
  }

  componentDidMount() {
    this.getActivities();
  }

  getActivities = () => {
    // axios.get(`/api/trips/${this.props.tripId}/activities`).then(res => {
    //   this.setState({activitiesList: res.data})
    // })
  }

  toggleCategoriesSelection = () => {
    this.setState({
      showCategoriesSelection: !this.state.showCategoriesSelection
    })
  }

  handleSelectCategory = (event) => {
    const { checkedCategories } = this.state;
    const category = event.target.value;
    const categoryIndex = checkedCategories.indexOf(category);
    if (categoryIndex > -1) {
      // remove from list
      this.setState({
        checkedCategories: [...checkedCategories.slice(0,categoryIndex), ...checkedCategories.slice(categoryIndex+1)]
      });
    } else {
      checkedCategories.push(category);
    }
  }
  
  handleSortedBy = (event) => {
    const { sortedBy } = this.state;
    this.setState({ sortedBy: event.target.value });
  }

  render() {
    const {
      showCategoriesSelection,
      checkedCategories,
      sortedBy
    } = this.state;

    const {
      showEditModal,
      showCreateModal,
      toggleCreateEventModal,
      userId,
      activitiesList
    } = this.props;

    const categories = uniq(activitiesList.filter((act) => act.category).map((act) => act.category));
    // Sort by alphabetical order
    categories.sort((word1, word2) => { 
      if (word2.toLowerCase() > word1.toLowerCase()) {
        return -1;
      } else if (word1.toLowerCase() > word2.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    let displayedActivitiesList = checkedCategories.length > 0 ? 
      activitiesList.filter((activity) => {
        return checkedCategories.indexOf(activity.category) > -1;
      }) :
      activitiesList;

    if (sortedBy === "mostRecent") {
      displayedActivitiesList = reverse(displayedActivitiesList);
    } else if (sortedBy === "name") {
      displayedActivitiesList.sort((activity1, activity2) => { 
        if (activity2.name.toLowerCase() > activity1.name.toLowerCase()) {
          return -1;
        } else if (activity1.name.toLowerCase() > activity2.name.toLowerCase()) {
          return 1;
        }
        return 0;
      });
    } else if (sortedBy === "votes") {
      displayedActivitiesList = sortBy(displayedActivitiesList, ['votes']);
    }

    const categoriesSelection = (
      <div>
        {categories.map((category, i) => {
          const checked = checkedCategories.indexOf(category) !== -1;
          return (
            <div key={i}>
              <input 
                type="checkbox" 
                value={category} 
                onChange={this.handleSelectCategory}
                checked={checked}
              />
              {category}
              <br/>
            </div>
          )
        })}
      </div>
    )

    return (
      <div className="activities-container">
        <div className="activity-header">
          <h2>Activities</h2>
          <AddButton
            className="add-btn"
            onButtonClick={showCreateModal}
          />
        </div>
        <div className="activities-filter-category" onClick={this.toggleCategoriesSelection}>
          Filter by Category 
          {!showCategoriesSelection &&
            <i className="fas fa-caret-down"></i>
          }
          {showCategoriesSelection &&
            <i className="fas fa-caret-up"></i>
          }
        </div>
        {showCategoriesSelection &&
          categoriesSelection
        }

        <div>
          Sort by: 
          <select onChange={this.handleSortedBy} default="leastRecent">
            <option value="leastRecent">Least Recent</option>
            <option value="mostRecent">Most Recent</option>
            <option value="name">Name</option>
            <option value="votes">Votes</option>
          </select>
        </div>

        <div className="activities-list">
          {displayedActivitiesList.map(function(act, index){
            return (<ActivityItem 
              key={index}
              showEditModal={showEditModal}
              activity={act}
              toggleCreateEventModal={toggleCreateEventModal}
              userId={userId}
            />)
          })}
        </div>
      </div>
    )
  }
}

export default Activities;
