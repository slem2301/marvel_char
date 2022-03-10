import { Component } from "react";
import ErrorMeassage from "../errorMessage/ErrorMeassage";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    // static getDerivedStateFromError(error) {
    //     return {error: true};
    // }

    componentDidCatch(err, info) {
        console.log(err, info);
        this.setState({error: true});
    }

    render() {
        if (this.state.error) {
            return <ErrorMeassage/>
        }
        
        return this.props.children;
    }
}

export default ErrorBoundary;