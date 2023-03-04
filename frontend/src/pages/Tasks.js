 
import React, {Component} from 'react';
import AuthContext from '../context/auth-context';


// Material-UI components (https://material-ui.com/)
import { withStyles } from '@material-ui/core/styles';
import Modal from '../components/Modal/EditTaskModal';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Lists from '../components/Tasks/TaskList/Lists'
import AddTask from '../components/Tasks/AddTask/AddTask';
import PriorityPopper from '../components/Tasks/AddTask/Popper/Popper';
import DatePicker from '../components/Tasks/AddTask/Pickers/DatePicker';
import RepeatTask from '../components/Tasks/AddTask/Repeat/Repeat'
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

// Style for Material-UI components
const styles = theme => ({
    root: {
        display: 'flex',
        paddingTop: '64px',
        // paddingLeft: '260px',
        flexDirection: 'column',
        [theme.breakpoints.down('md')]:{
            paddingTop: '1px',
            paddingLeft: '1px',
        }
    },
    taskView: {
        maxWidth: '60vw',
        padding: theme.spacing(3,1),
        [theme.breakpoints.down('md')]:{
            maxWidth: '100vw',
        },
    },
    addTaskIcons: {
        display: 'flex',
        flexDirection: 'row',
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: theme.spacing(10),
    },
    taskEdit: {
        display: 'flex',
    },
  });
class TasksPage extends Component {
    state = {
        creating: false,
        updating: false,
        tasks: [],
        isLoading: false,
        updatedTask: null
    };

    isActive = true;

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.priorityElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.dateRepeatElRef = React.createRef();
        this.completeElRef = React.createRef();
    }

    // componentDidMount() executes when the page loads = is invoked immediately
    // after a component is mounted (inserted into the tree).
    componentDidMount() {
        this.fetchTasks();
    };

    startCreateTaskHandler = () => {
        this.setState({creating: true});
    };

    modalConfirmHandler = () => {
        this.setState({creating: false});
        const title = this.titleElRef.current.value;
        const priority = +this.priorityElRef.current.value;
        let date = this.dateElRef.current.value;
        let dateRepeat = this
            .dateRepeatElRef
            .current
            .value
            .split(",");
        let start = null;
        let end = null;
        let intervalK = null;
        let intervalN = null;
        if (dateRepeat.length > 1) {
            start = new Date(dateRepeat[0]).toISOString();
            end = new Date(dateRepeat[1]).toISOString();
            intervalK = parseInt(dateRepeat[2]);
            intervalN = dateRepeat[3];
            date = start;
        }
        console.log(dateRepeat);
        // to check input some data isn't empty. trim()-remove whitespace from both
        // sides of a string.
        if (title.trim().length === 0 || priority <= 0) {
            return;
        };

        if (date.length === 0) {
            date = null;
        };

        // the task is an object with properties title: title, priority: priority, etc.
        const task = {
            title,
            priority,
            date,
            start,
            end,
            intervalK,
            intervalN
        };
        console.log("check if the task object is rigth: ", task)

        const requestBody = {
            query: `
                mutation CreateTask($title: String!, $priority: Float!, $date: String, $start: String, $end: String, $intervalK: Float, $intervalN: String) {
                    createTask(taskInput: {title: $title, priority: $priority, date: $date, complete: false, start: $start, end: $end, intervalK: $intervalK, intervalN: $intervalN}) {
                        _id
                        title
                        priority
                        date
                        complete
                        start
                        end
                        intervalK
                        intervalN
                    }
                }
            `,
            variables: {
                title: title,
                priority: priority,
                date: date,
                start: start,
                end: end,
                intervalK: intervalK,
                intervalN: intervalN
            }
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('it is Failed ');
            }
            return res.json();
        }).then(resData => {
            this.setState(prevState => {
                const updatedTasks = [...prevState.tasks];
                console.log("resData after save: ", resData.data.createTask);
                updatedTasks.push({
                    _id: resData.data.createTask._id,
                    title: resData.data.createTask.title,
                    priority: resData.data.createTask.priority,
                    date: resData.data.createTask.date === "1970-01-01T00:00:00.000Z"
                        ? null
                        : resData.data.createTask.date,
                    complete: resData.data.createTask.complete,
                    end: resData.data.createTask.end === "1970-01-01T00:00:00.000Z"
                    ? null
                    : resData.data.createTask.end,
                    creator: {
                        _id: this.context.userId
                    }
                });
                return {tasks: updatedTasks};
            });
            this.titleElRef.current.value = '';
        }).catch(err => {
            console.log(err);
        });
    };

    modalCancelHandler = () => {
        this.setState({creating: false, updating: false, selectedTask: null});
    };

    fetchTasks() {
        this.setState({isLoading: true});
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

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('it is Failed ');
            }
            return res.json();
        }).then(resData => {
            const tasks = resData
                .data
                .tasks
                .map(task => {
                    if (task.date === "1970-01-01T00:00:00.000Z") {
                        task.date = null;
                    } else {
                        task.date = new Date(task.date).toISOString();
                    }
                    return task;

                });
            console.log(tasks);
            if (this.isActive) {
                this.setState({tasks: tasks, isLoading: false});
            }
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: false});
        });
    };

    startEditTaskHandler = taskId => {
        this.setState({updating: true, updatedTask: taskId});
        console.log('updating state ',this.state.updating)
    };

    editTaskHandler = () => {
        this.setState({updating: false});
        const taskId = this.state.updatedTask;
        const title = this.titleElRef.current.value;
        const priority = +this.priorityElRef.current.value;
        let date = this.dateElRef.current.value;
        let dateRepeat = this
        .dateRepeatElRef
        .current
        .value
        .split(",");
        let start = null;
        let end = null;
        let intervalK = null;
        let intervalN = null;
        if (dateRepeat.length > 1) {
            start = new Date(dateRepeat[0]).toISOString();
            end = new Date(dateRepeat[1]).toISOString();
            intervalK = parseInt(dateRepeat[2]);
            intervalN = dateRepeat[3];
            date = start;
        }

        const requestBody = {
            query: `
                mutation EditTask($id: ID!, $title: String, $priority: Float, $date: String, $start: String, $end: String, $intervalK: Float, $intervalN: String) {
                    updateTask(taskId: $id, taskInput: {title: $title,  priority: $priority, date: $date, start: $start, end: $end, intervalK: $intervalK, intervalN: $intervalN}) {
                        _id
                        title
                        priority
                        date
                        complete
                        start
                        end
                        intervalK
                        intervalN
                    }
                }
            `,
            variables: {
                id: taskId,
                title: title,
                priority: priority,
                date: date,
                start: start,
                end: end,
                intervalK: intervalK,
                intervalN: intervalN
            }
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed ');
            }
            return res.json();
        }).then(resData => {
            console.log('update resData', resData);
            this.setState(prevState => {
                const updatedTasks = [...prevState.tasks];
                function formatedDate (date) {
                    return new Date(parseInt(date)).toISOString();
                };
                const taskIndex = updatedTasks.findIndex((task => task._id === resData.data.updateTask._id));
                updatedTasks[taskIndex].title = resData.data.updateTask.title;
                updatedTasks[taskIndex].priority = resData.data.updateTask.priority;
                updatedTasks[taskIndex].date = formatedDate(resData.data.updateTask.date);
                if(resData.data.updateTask.start) {
                    updatedTasks[taskIndex].start = formatedDate(resData.data.updateTask.start);
                    updatedTasks[taskIndex].date = updatedTasks[taskIndex].start;
                    updatedTasks[taskIndex].end = formatedDate(resData.data.updateTask.end);
                    updatedTasks[taskIndex].intervalK = +resData.data.updateTask.intervalK;
                    updatedTasks[taskIndex].intervalN = resData.data.updateTask.intervalN; 
                }              
                return {tasks: updatedTasks, updatedTask: null};
            });

        }).catch(err => {
            console.log(err);
        });
    };

    completeTaskHandler = taskId => {
        const requestBody = {
            query: `
                mutation CompleteTask($id: ID!) {
                    completeTask(taskId: $id) {
                        _id
                        title
                        priority
                        date
                        complete
                    }
                }
            `,
            variables: {
                id: taskId
            }
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed ');
            }
            return res.json();
        }).then(resData => {
            this.setState(prevState => {
                const updatedTasks = [...prevState.tasks];
                console.log(updatedTasks);
                const taskIndex = updatedTasks.findIndex((task => task._id === resData.data.completeTask._id));
                if (resData.data.completeTask.date === null) {
                    updatedTasks[taskIndex].date = null;
                } else {
                    updatedTasks[taskIndex].date = new Date(parseInt(resData.data.completeTask.date)).toISOString();
                }
                updatedTasks[taskIndex].complete = resData.data.completeTask.complete;
                return {tasks: updatedTasks};
            });

        }).catch(err => {
            console.log(err);
        });
    };

    deleteTaskHandler = taskId => {
        const requestBody = {
            query: `
            mutation DeleteTask($id: ID!) {
                deleteTask(taskId: $id) {
                    _id
                    title
                }
            }
        `,
            variables: {
                id: taskId
            }
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed ');
            }
            return res.json();
        }).then(resData => {
            this.setState(prevState => {
                const updatedTasks = prevState
                    .tasks
                    .filter(task => {
                        return task._id !== taskId;
                    });
                return {tasks: updatedTasks};
            });
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: false});
        });
    };
    // componentWillUnmount() is invoked immediately before a component is unmounted
    // and destroyed. Perform any necessary cleanup in this method, such as
    // invalidating timers, canceling network requests, or cleaning up any
    // subscriptions that were created in componentDidMount().
    componentWillUnmount() {
        this.isActive = false;
    };

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <div className={classes.root}>
                <CssBaseline />
                <Container maxWidth="sm">
                <div className={classes.taskView}>
                {this.context.token && 
                    <TextField
                        id="outlined-basic"
                        label="Add task"
                        variant="outlined"
                        size="medium"
                        multiline
                        fullWidth
                        inputRef={this.titleElRef}
                        onClick={this.startCreateTaskHandler}/>
                }

                {this.state.creating && <AddTask
                    onCancel={this.modalCancelHandler}
                    onConfirm={this.modalConfirmHandler}>
                    <form className={classes.addTaskIcons}>
                            <PriorityPopper ref={this.priorityElRef}/>
                            <DatePicker ref={this.dateElRef}/>
                            <RepeatTask ref={this.dateRepeatElRef}/>
                    </form>
                </AddTask>}

                {this.state.isLoading
                    ? <div className={classes.spinner}> 
                        <CircularProgress 
                        color="secondary" /> 
                      </div>
                    : <Lists
                        tasks={this.state.tasks}
                        authUserIdMain={this.context.userId}
                        onViewDetailMain={this.showDetailHandler}
                        onDeleteTaskMain={this.deleteTaskHandler}
                        onEditTaskMain={this.startEditTaskHandler}
                        onCompleteTaskMain={this.completeTaskHandler} />
                    }
                </div>
                </Container>

                {this.state.updating && <Modal
                    onCancel={this.modalCancelHandler}
                    onConfirm={this.editTaskHandler}
                    confirmText="confirm">
                    <form className={classes.taskEdit}>
                    <TextField
                        id="outlined-basic"
                        label="Edit task"
                        variant="outlined"
                        size="medium"
                        multiline
                        fullWidth
                        inputRef={this.titleElRef}/>
                    <PriorityPopper ref={this.priorityElRef}/>
                    <DatePicker ref={this.dateElRef}/>
                    <RepeatTask ref={this.dateRepeatElRef}/>
                    <div>
                    <IconButton onClick={this.deleteTaskHandler.bind(this, this.state.updatedTask)}>
                        <DeleteOutlineIcon color="secondary"/>
                    </IconButton>
                    </div>
                    </form>
                </Modal>}
                </div>
            </React.Fragment>
        );
    }
};

export default withStyles(styles)(TasksPage);