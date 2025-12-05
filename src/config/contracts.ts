export const CONTRACTS = {
  // Official BUSDT on BSC Testnet
  BUSDT: import.meta.env.VITE_BUSDT_ADDRESS || '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
  
  // AHAN Platform Contracts
  LQBUSD: import.meta.env.VITE_LQBUSD_ADDRESS || '0x42E35b0198102C6c336728d56Cd30114C415D9BE',
  POOL: import.meta.env.VITE_POOL_ADDRESS || '0x0f85EC2A15a5FC317af2150Bd03c7C3C21c3D5aa',
} as const

export const BUSDT_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
]

export const LQBUSD_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function owner() view returns (address)',
  'function transferOwnership(address newOwner)',
]

export const POOL_ABI = [
  'function deposit(uint256 amount)',
  'function withdraw(uint256 amount)',
  'function getLenderPosition(address lender) view returns (uint256 depositedAmount, uint256 lqBUSDBalance, uint256 depositTimestamp)',
  'function getPoolStats() view returns (uint256 deposits, uint256 borrowed, uint256 available, uint256 utilization)',
  'event Deposited(address indexed lender, uint256 amount, uint256 lqBUSDMinted)',
  'event Withdrawn(address indexed lender, uint256 amount, uint256 lqBUSDBurned)',
]
