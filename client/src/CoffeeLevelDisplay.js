import React from 'react';

// using PureComponent avoids unnecessary re-renders
export default class CoffeeLevelDisplay extends React.PureComponent{
    state = {coffeeLevelKey:null};

    componentDidMount() {
        const { drizzle } = this.props;
        const contract = drizzle.contracts.Coffee;

        // get and save the key for the variable we are interested in
        const coffeeLevelKey = contract.methods["getCoffeeLevel"].cacheCall();
        this.setState({ coffeeLevelKey });
    }

    render() {
        const { Coffee } = this.props.drizzleState.contracts;
        const storedData = Coffee.getCoffeeLevel[this.state.coffeeLevelKey];
        return (
            <p> CoffeeLevel: {storedData && storedData.value}</p>
        );
    }
}

