import React from 'react';


// using PureComponent avoids unnecessary re-renders
export default class DirtLevelDisplay extends React.PureComponent{
    state = {dirtLevelKey:null};

    componentDidMount() {
        const { drizzle } = this.props;
        const contract = drizzle.contracts.Coffee;

        // get and save the key for the variable we are interested in
        const dirtLevelKey = contract.methods["getDirtLevel"].cacheCall();
        this.setState({ dirtLevelKey });
    }

    render() {
        const { Coffee } = this.props.drizzleState.contracts;
        const storedData = Coffee.getDirtLevel[this.state.dirtLevelKey];
        return (
            <p> DirtLevel: {storedData && storedData.value}</p>
        );
    }
}

