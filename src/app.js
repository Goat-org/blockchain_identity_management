App = {
    loading: false,
    contracts: {},

    load: async () => {
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
    },

    // Load Web3
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            window.alert("Please connect to MetaMask.");
        }

        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                // Request account access if needed
                await ethereum.enable();
            } catch (error) {
                console.error('User denied account access');
            }
        } else if (window.web3) {
            App.web3Provider = web3.currentProvider;
            window.web3 = new Web3(web3.currentProvider);
        } else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    },

    // Load the user's account
    loadAccount: async () => {
        const accounts = await web3.eth.getAccounts();
        App.account = accounts[0];
        console.log(App.account)
    },

    // Load the smart contract
    loadContract: async () => {
        const identityManagement = await $.getJSON('identity_management.json'); // Ensure this JSON file is present
        App.contracts.identityManagement = TruffleContract(identityManagement);
        App.contracts.identityManagement.setProvider(App.web3Provider);

        App.identityManagement = await App.contracts.identityManagement.deployed();
    },

    // Render the app
    render: async () => {
        if (App.loading) {
            return;
        }

        App.setLoading(true);

        // Render Account
        $('#account').html(App.account);

        App.setLoading(false);
    },

    // Submit user data (first name, last name, birth date)
    submitForm: async () => {
        App.setLoading(true);

        const fName = $('#fName').val();
        const lName = $('#lName').val();
        const birthDate = $('#birthDate').val();

        try {
            await App.identityManagement.submitForm(fName, lName, birthDate, { from: App.account });
            alert("Form submitted successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Error submitting form");
        }

        App.setLoading(false);
    },

    // Retrieve user data by address
    getUserData: async () => {
        const userAddress = $('#userAddress').val();

        try {
            const userData = await App.identityManagement.getUser(userAddress);

            const fName = userData[0];
            const lName = userData[1];
            const birthDate = userData[2];

            $('#user-data').html(`
                <h3>User Data</h3>
                <p><strong>First Name:</strong> ${fName}</p>
                <p><strong>Last Name:</strong> ${lName}</p>
                <p><strong>Birth Date:</strong> ${birthDate}</p>
            `);
        } catch (error) {
            console.error("Error retrieving user data:", error);
            alert("Error retrieving user data");
        }
    },

    setLoading: (boolean) => {
        App.loading = boolean;
        const loader = $('#loader');
        const content = $('#content');
        if (boolean) {
            loader.show();
            content.hide();
        } else {
            loader.hide();
            content.show();
        }
    }
};

// Initialize the app when the window loads
$(() => {
    $(window).load(() => {
        App.load();
    });
});