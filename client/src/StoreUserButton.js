import React from 'react';


export default class StoreUserButton extends React.PureComponent {
    state = {
        stackID:null,
        userKey:null
    };

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        const {drizzle} = this.props;

        const userKey = drizzle.contracts.Coffee.methods["getUser"].cacheCall();
        this.setState({userKey:userKey});
    }

    storeUserOnContract () {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Coffee;

        const stackID = contract.methods["storeUser"].cacheSend(
            drizzleState.accounts[0],
            {from:drizzleState.accounts[0]}
            );
        this.setState({stackID:stackID});
    }

    isCurrentUserOnContract () {
        const { drizzleState } = this.props;
        const { Coffee } = drizzleState.contracts;
        console.log(Coffee.getUser[this.state.userKey] );
        const user = Coffee.getUser[this.state.userKey];
        if (user === undefined) return false;
        return (user.value === drizzleState.accounts[0]);
    }

    getTxStatus = () => {
        // get the transaction states from the drizzle state
        const { transactions, transactionStack } = this.props.drizzleState;

        // get the transaction hash using our saved `stackId`
        const txHash = transactionStack[this.state.stackID];

        // if transaction hash does not exist, don't display anything
        if (!txHash) return null;

        // otherwise, return the transaction status
        return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
    };

    handleClick(){
        this.storeUserOnContract();

    }

    render() {
        return(
            this.isCurrentUserOnContract() ?
                <div>
                    <p> You are already in! </p>
                </div>
            :
                <div>
                    <div> --------------- </div>
                    <button onClick={this.handleClick}>Add me to the coffee users </button>
                    <div> ------ {this.getTxStatus()} ------ </div>
                </div>
        )
    }

}