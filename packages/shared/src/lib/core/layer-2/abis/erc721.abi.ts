import { ContractAbi } from 'web3'
import { ERC165_ABI } from './erc165.abi'
import { AbiType } from '../enums/abi-type.enum'
import { StateMutabilityType } from '../enums/state-mutability-type.enum'

const ERC721_BASE_ABI: ContractAbi = [
    {
        inputs: [],
        payable: false,
        stateMutability: StateMutabilityType.NonPayable,
        type: AbiType.Constructor,
    },

    // / @dev This emits when ownership of any NFT changes by any mechanism.
    // /  This event emits when NFTs are created (`from` == 0) and destroyed
    // /  (`to` == 0). Exception: during contract creation, any number of NFTs
    // /  may be created and assigned without emitting Transfer. At the time of
    // /  any transfer, the approved address for that NFT (if any) is reset to none.
    // /
    // / event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    {
        type: AbiType.Event,
        name: 'Transfer',
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        anonymous: false,
    },

    // / @dev This emits when the approved address for an NFT is changed or
    // /  reaffirmed. The zero address indicates there is no approved address.
    // /  When a Transfer event emits, this also indicates that the approved
    // /  address for that NFT (if any) is reset to none.
    // /
    // / event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    {
        type: AbiType.Event,
        name: 'Approval',
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'approved',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        anonymous: false,
    },

    // / @dev This emits when an operator is enabled or disabled for an owner.
    // /  The operator can manage all NFTs of the owner.
    // /
    // / event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
    {
        type: AbiType.Event,
        name: 'ApprovalForAll',
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'approved',
                type: 'bool',
            },
        ],
        anonymous: false,
    },

    // @notice Count all NFTs assigned to an owner
    // / @dev NFTs assigned to the zero address are considered invalid, and this
    // /  function throws for queries about the zero address.
    // / @param _owner An address for whom to query the balance
    // / @return The number of NFTs owned by `_owner`, possibly
    // /
    // / function balanceOf(address _owner) external view returns(uint256);
    {
        type: AbiType.Function,
        name: 'balanceOf',
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        constant: true,
        payable: false,
        stateMutability: StateMutabilityType.View,
    },

    // / @notice Find the owner of an NFT
    // / @dev NFTs assigned to zero address are considered invalid, and queries
    // /  about them do throw.
    // / @param _tokenId The identifier for an NFT
    // / @return The address of the owner of the NFT
    // /
    // / function ownerOf(uint256 _tokenId) external view returns(address);
    {
        type: AbiType.Function,
        name: 'ownerOf',
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        constant: true,
        payable: false,
        stateMutability: StateMutabilityType.View,
    },

    // / @notice Transfers the ownership of an NFT from one address to another address
    // / @dev Throws unless `msg.sender` is the current owner, an authorized
    // /  operator, or the approved address for this NFT. Throws if `_from` is
    // /  not the current owner. Throws if `_to` is the zero address. Throws if
    // /  `_tokenId` is not a valid NFT. When transfer is complete, this function
    // /  checks if `_to` is a smart contract (code size > 0). If so, it calls
    // /  `onERC721Received` on `_to` and throws if the return value is not
    // /  `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`.
    // / @param _from The current owner of the NFT
    // / @param _to The new owner
    // / @param _tokenId The NFT to transfer
    // / @param data Additional data with no specified format, sent in call to `_to`
    // /
    // / function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable;
    {
        type: AbiType.Function,
        name: 'safeTransferFrom',
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: '_data',
                type: 'bytes',
            },
        ],
        constant: false,
        outputs: [],
        payable: true,
        stateMutability: StateMutabilityType.Payable,
    },

    // / @notice Transfers the ownership of an NFT from one address to another address
    // / @dev This works identically to the other function with an extra data parameter,
    // /  except this function just sets data to "".
    // / @param _from The current owner of the NFT
    // / @param _to The new owner
    // / @param _tokenId The NFT to transfer
    // /
    // / function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;
    {
        type: AbiType.Function,
        name: 'safeTransferFrom',
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        outputs: [],
        constant: false,
        payable: true,
        stateMutability: StateMutabilityType.Payable,
    },

    // / @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    // /  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    // /  THEY MAY BE PERMANENTLY LOST
    // / @dev Throws unless `msg.sender` is the current owner, an authorized
    // /  operator, or the approved address for this NFT. Throws if `_from` is
    // /  not the current owner. Throws if `_to` is the zero address. Throws if
    // /  `_tokenId` is not a valid NFT.
    // / @param _from The current owner of the NFT
    // / @param _to The new owner
    // / @param _tokenId The NFT to transfer
    // /
    // / function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
    {
        type: AbiType.Function,
        name: 'transferFrom',
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        outputs: [],
        constant: false,
        payable: true,
        stateMutability: StateMutabilityType.Payable,
    },

    // / @notice Change or reaffirm the approved address for an NFT
    // / @dev The zero address indicates there is no approved address.
    // /  Throws unless `msg.sender` is the current NFT owner, or an authorized
    // /  operator of the current owner.
    // / @param _approved The new approved NFT controller
    // / @param _tokenId The NFT to approve
    // /
    // / function approve(address _approved, uint256 _tokenId) external payable;
    {
        type: AbiType.Function,
        name: 'approve',
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        outputs: [],
        constant: false,
        payable: true,
        stateMutability: StateMutabilityType.Payable,
    },

    // / @notice Enable or disable approval for a third party ("operator") to manage
    // /  all of `msg.sender`'s assets
    // / @dev Emits the ApprovalForAll event. The contract MUST allow
    // /  multiple operators per owner.
    // / @param _operator Address to add to the set of authorized operators
    // / @param _approved True if the operator is approved, false to revoke approval
    // /
    // / function setApprovalForAll(address _operator, bool _approved) external;
    {
        type: AbiType.Function,
        name: 'setApprovalForAll',
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'bool',
                name: 'approved',
                type: 'bool',
            },
        ],
        outputs: [],
        constant: false,
        payable: false,
        stateMutability: StateMutabilityType.NonPayable,
    },

    // / @notice Get the approved address for a single NFT
    // / @dev Throws if `_tokenId` is not a valid NFT.
    // / @param _tokenId The NFT to find the approved address for
    // / @return The approved address for this NFT, or the zero address if there is none
    // /
    // /function getApproved(uint256 _tokenId) external view returns(address);
    {
        type: AbiType.Function,
        name: 'getApproved',
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        constant: true,
        payable: false,
        stateMutability: StateMutabilityType.View,
    },

    // / @notice Query if an address is an authorized operator for another address
    // / @param _owner The address that owns the NFTs
    // / @param _operator The address that acts on behalf of the owner
    // / @return True if `_operator` is an approved operator for `_owner`, false otherwise
    // /
    // / function isApprovedForAll(address _owner, address _operator) external view returns(bool);
    {
        type: AbiType.Function,
        name: 'isApprovedForAll',
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
        ],
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        constant: true,
        payable: false,
        stateMutability: StateMutabilityType.View,
    },
]

export const ERC721_METADATA_ABI: ContractAbi = [
    // / @notice A descriptive name for a collection of NFTs in this contract
    // /
    // / function name() external view returns (string _name);
    {
        type: AbiType.Function,
        name: 'name',
        inputs: [],
        outputs: [
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
        ],
        constant: true,
        payable: false,
        stateMutability: StateMutabilityType.View,
    },

    // / @notice An abbreviated name for NFTs in this contract
    // /
    // / function symbol() external view returns (string _symbol);
    {
        type: AbiType.Function,
        name: 'symbol',
        inputs: [],
        outputs: [
            {
                internalType: 'string',
                name: 'symbol',
                type: 'string',
            },
        ],
        constant: true,
        payable: false,
        stateMutability: StateMutabilityType.View,
    },

    // / @notice A distinct Uniform Resource Identifier (URI) for a given asset.
    // / @dev Throws if `_tokenId` is not a valid NFT. URIs are defined in RFC
    // /  3986. The URI may point to a JSON file that conforms to the "ERC721
    // /  Metadata JSON Schema".
    // /
    // / function tokenURI(uint256 _tokenId) external view returns (string);
    {
        type: AbiType.Function,
        name: 'tokenURI',
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        constant: true,
        payable: false,
        stateMutability: StateMutabilityType.View,
    },
]

export const ERC721_ENUMERABLE_ABI: ContractAbi = [
    // / @notice Count NFTs tracked by this contract
    // / @return A count of valid NFTs tracked by this contract, where each one of
    // /  them has an assigned and queryable owner not equal to the zero address
    // /
    // / function totalSupply() external view returns(uint256);
    {
        type: AbiType.Function,
        name: 'totalSupply',
        inputs: [],
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        constant: true,
        payable: false,
        stateMutability: StateMutabilityType.View,
    },

    // / @notice Enumerate valid NFTs
    // / @dev Throws if `_index` >= `totalSupply()`.
    // / @param _index A counter less than `totalSupply()`
    // / @return The token identifier for the `_index`th NFT,
    // /  (sort order not specified)
    // /
    // / function tokenByIndex(uint256 _index) external view returns(uint256);
    {
        type: AbiType.Function,
        name: 'tokenByIndex',
        inputs: [
            {
                internalType: 'uint256',
                name: 'index',
                type: 'uint256',
            },
        ],
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        constant: true,
        payable: false,
        stateMutability: StateMutabilityType.View,
    },

    // / @notice Enumerate NFTs assigned to an owner
    // / @dev Throws if `_index` >= `balanceOf(_owner)` or if
    // /  `_owner` is the zero address, representing invalid NFTs.
    // / @param _owner An address where we are interested in NFTs owned by them
    // / @param _index A counter less than `balanceOf(_owner)`
    // / @return The token identifier for the `_index`th NFT assigned to `_owner`,
    // /   (sort order not specified)
    // /
    // / function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns(uint256);
    {
        type: AbiType.Function,
        name: 'tokenOfOwnerByIndex',
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'index',
                type: 'uint256',
            },
        ],
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        constant: true,
        payable: false,
        stateMutability: StateMutabilityType.View,
    },
]

export const ERC721_ABI: ContractAbi = [
    ...ERC165_ABI,
    ...ERC721_BASE_ABI,
    ...ERC721_METADATA_ABI,
    ...ERC721_ENUMERABLE_ABI,
]
