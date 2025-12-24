# School Management Smart Contract

A Solidity-based smart contract for managing student records on the Ethereum blockchain using Hardhat development environment.

## Features

- **Access Control**: Only the contract owner can manage student records
- **Student Registration**: Register new students with name and age validation
- **Student Updates**: Update student names and status
- **Student Status Management**: Track student status (ACTIVE, DEFERRED, RUSTICATED)
- **Student Retrieval**: Get students by ID, index, or name
- **Student Deletion**: Remove students from the system
- **Event Emissions**: Track all operations with blockchain events
- **Owner Management**: Contract owner is set on deployment

## Student Status Types

- `ACTIVE` (0): Student is currently enrolled
- `DEFERRED` (1): Student has deferred enrollment
- `RUSTICATED` (2): Student has been rusticated

## Prerequisites

- Node.js v18 or higher
- npm or yarn package manager
- MetaMask or similar web3 wallet (for testnet deployment)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd school-management
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
   - Add your Infura/Alchemy RPC URL
   - Add your private key (for testnet deployment)
   - Add your Etherscan API key (for contract verification)

## Usage

### Compile the Contract

```bash
npm run compile
```

### Run Tests

Run all tests:
```bash
npm test
```

Run TypeScript tests only:
```bash
npm run test:ts
```

### Deploy the Contract

#### Local Hardhat Network

1. Start a local Hardhat node:
```bash
npm run node
```

2. In a new terminal, deploy to the local network:
```bash
npm run deploy:local
```

#### Sepolia Testnet

Ensure you have:
- Sepolia ETH in your wallet (get from faucet)
- `SEPOLIA_RPC_URL` configured in `.env`
- `PRIVATE_KEY` configured in `.env`

```bash
npm run deploy:sepolia
```

### Verify Contract on Etherscan

After deploying to Sepolia, verify your contract:

1. Get your Etherscan API key from https://etherscan.io/myapikey
2. Add it to your `.env` file:
```env
ETHERSCAN_API_KEY=your_api_key_here
```

3. Update the contract address in `scripts/verify.ts`
4. Run verification:
```bash
npm run verify
```

Or verify manually:
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## Contract Functions

### Write Functions

- `registerStudent(string memory _name, uint _age)`: Register a new student
- `updateStudent(uint _id, string memory _newName)`: Update student name
- `updateStudentStatus(uint _id, Status _newStatus)`: Update student status
- `deleteById(uint _id)`: Delete a student by ID

### Read Functions

- `getById(uint _id)`: Get student details by ID
- `getAll()`: Get all registered students
- `getStudentCount()`: Get total number of students
- `getStudentByIndex(uint _index)`: Get student by array index
- `findStudentByName(string memory _name)`: Find students by name

## Events

The contract emits the following events:

- `StudentRegistered(uint indexed studentId, string name, uint age, Status status)`
- `StudentUpdated(uint indexed studentId, string newName)`
- `StudentStatusChanged(uint indexed studentId, Status newStatus)`
- `StudentDeleted(uint indexed studentId)`

## Project Structure

```
school-management/
├── contracts/
│   └── SchoolManagement.sol    # Main smart contract
├── scripts/
│   ├── deploy.js              # JavaScript deployment script
│   └── deploy.ts              # TypeScript deployment script
├── test/
│   ├── SchoolManagement.js    # JavaScript tests
│   └── SchoolManagement.ts    # TypeScript tests
├── hardhat.config.js          # Hardhat configuration
├── package.json               # Project dependencies
└── README.md                  # Project documentation
```

## Testing

The project includes comprehensive test coverage for:

- Contract deployment
- Student registration with validation
- Student updates (name and status)
- Student retrieval (by ID, index, and name)
- Student deletion
- Event emissions
- Edge cases and error handling

Run tests with:
```bash
npm test
```

## Security Considerations

- **Access Control**: All administrative functions are restricted to contract owner
- **Input Validation**: Implemented for student names and ages
- **Event Logging**: All state changes emit events for transparency
- **Error Handling**: Descriptive revert messages for all edge cases
- **ID-based Lookups**: Existence checks before operations
- **Owner-only Functions**: `registerStudent`, `updateStudent`, `updateStudentStatus`, `deleteById`

## Deployed Contract

The contract is deployed on Ethereum Sepolia testnet:

- **Contract Address**: `0xdB43ef44E2Ad3B1f33F0573ADD326B86D6832e0B`
- **Network**: Sepolia Testnet
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0xdB43ef44E2Ad3B1f33F0573ADD326B86D6832e0B)

## Development

### Building

Compile contracts:
```bash
npx hardhat compile
```

### Testing

Run tests:
```bash
npx hardhat test
```

### Network Configuration

The project supports the following networks:

- **Hardhat Network**: Local development network (chainId: 1337)
- **Localhost**: Local Hardhat node (http://127.0.0.1:8545)
- **Sepolia**: Ethereum testnet (requires RPC URL and private key)

## Gas Optimization

The contract includes:
- Solidity compiler optimization enabled (200 runs)
- Efficient array management for student records
- Minimal storage operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review test files for usage examples

## Disclaimer

This is a demonstration project. Do not use in production without proper security audits and testing.