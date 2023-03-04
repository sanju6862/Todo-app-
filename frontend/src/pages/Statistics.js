 
import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import { today } from "../dateHelpers/dateHelpers";
import Overview from "../components/Statistics/Overview";
import BarChart from "../components/Statistics/BarChart";
import AreaChart from "../components/Statistics/AreaChart";

// (http://recharts.org/).
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

// Material-UI components (https://material-ui.com/).
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

// Style for Material-UI components
const styles = theme => ({
  root: {
    display: "flex",
    paddingTop: "84px",
    paddingLeft: "220px",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      paddingTop: "1px",
      paddingLeft: "1px"
    }
  },
  paper: {
    padding: theme.spacing(1.5)
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.spacing(10)
  }
});

const COLORS = ["#82b5f2", "#fd76a2"];

class StatisticsPage extends Component {
  state = {
    tasks: [],
    isLoading: false,
    complete: null,
    incomplete: null,
    overdue: null,
    total: null,
    pieData: []
  };

  isActive = true;

  static contextType = AuthContext;

  // componentDidMount() executes when the page loads = is invoked immediately
  // after a component is mounted (inserted into the tree).
  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
            tasks {
                _id
                title
                priority
                date
                complete
                start
                end
                intervalK
                intervalN
                creator {
                    _id
                    email
                }
            }
        }
    `
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("it is Failed ");
        }
        return res.json();
      })
      .then(resData => {
        const tasks = resData.data.tasks.map(task => {
          if (task.date === "1970-01-01T00:00:00.000Z") {
            task.date = null;
          } else {
            task.date = new Date(task.date).toISOString();
          }
          return task;
        });
        const total = tasks.length;
        const complete = tasks.filter(task => task.complete === true).length;
        const incomplete = total - complete;
        const overdue = tasks.filter(
          task => task.date < today && task.complete === false
        ).length;
        console.log(tasks);
        if (this.isActive) {
          this.setState({
            tasks: tasks,
            isLoading: false,
            complete: complete,
            incomplete: incomplete,
            overdue: overdue,
            total: total
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  // componentWillUnmount() is invoked immediately before a component is unmounted
  // and destroyed. Perform any necessary cleanup in this method, such as
  // invalidating timers, canceling network requests, or cleaning up any
  // subscriptions that were created in componentDidMount().
  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    const { classes } = this.props;
    const pieData = [
      {
        name: "Complete",
        value: this.state.complete
      },
      {
        name: "Incomplete",
        value: this.state.incomplete
      }
    ];
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Container maxWidth="md">
          <Typography component="h1" variant="h4" color="primary" gutterBottom>
            Statistics
          </Typography>
          {this.state.isLoading ? (
            <div className={classes.spinner}>
              <CircularProgress color="secondary" />
            </div>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Typography
                    component="h2"
                    variant="h6"
                    color="primary"
                    gutterBottom
                  >
                    Overview
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid md={6} item xs={12} lg={6}>
                      <Overview
                        complete={this.state.complete}
                        incomplete={this.state.incomplete}
                        overdue={this.state.overdue}
                        total={this.state.total}
                      />
                    </Grid>
                    <Grid md={6} item xs={12} lg={6}>
                      <ResponsiveContainer width="100%" height={240}>
                        <PieChart onMouseEnter={this.onPieEnter}>
                          <Pie
                            data={pieData}
                            label
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                          >
                            {pieData.map((entry, index) => (
                              <Cell fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Paper className={classes.paper}>
                  <Typography
                    component="h2"
                    variant="h6"
                    color="primary"
                    gutterBottom
                  >
                    Week Completion Rate
                  </Typography>
                  <BarChart tasks={this.state.tasks} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Paper className={classes.paper}>
                  <Typography
                    component="h2"
                    variant="h6"
                    color="primary"
                    gutterBottom
                  >
                    Week Completion Curve
                  </Typography>
                  <AreaChart tasks={this.state.tasks} />
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </div>
    );
  }
}
export default withStyles(styles)(StatisticsPage);
