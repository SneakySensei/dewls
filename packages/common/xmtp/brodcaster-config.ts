interface BroadcastConfig {
  address: string;
  greeting: string;
  id: string;
}

const broadcastConfigs: BroadcastConfig[] = [
  {
    address: "0x85583261a4c3ad6785Ac90BD8880393831F97F54",
    greeting: "Welcome to Good morning XMTP Broadcasts",
    id: "XMTP",
  },
  {
    address: "0x189b416Ab2FbfbF90052Ca4C66fD509C16739353",
    greeting: "Welcome to Good Evening XMTP Broadcasts",
    id: "EVENING",
  },
  {
    address: "0xbA30066a24bC3FFEE24dE8126F5e5478e2e95B82",
    greeting: "Welcome to XMTP Demo Broadcasts",
    id: "DEMO",
  },
  {
    address: "0x013C3f9bfD875EF487c745048Eb8BA9B5A898b32",
    greeting: "You've subscribed to get awesome XMTP updates",
    id: "DEMO_1",
  },
  {
    address: "0x83A5D283F5B8c4D2c1913EA971a3B7FD8473F446",
    greeting:
      "You've subscribed during the weekly wrapup, we will now send you weekly updates on the XMTP roadmap",
    id: "WRAPUP",
  },
  {
    address: "0x4F44eE3011E1e82D1DBcce6dBDE140ba4818ad35",
    greeting: "You've subscribed during to Broadcast Test 1",
    id: "BROADCAST_TEST_1",
  },
  {
    address: "0x2E2252AB27c8D71B1Bf550adC24e3C1D1297b7eA",
    greeting: "You've subscribed during to Broadcast Test 2",
    id: "BROADCAST_TEST_2",
  },
];

interface BroadcastConfigEntities {
  addresses: string[];
  map: { [address: string]: BroadcastConfig };
}

export const broadCastConfigEntities = broadcastConfigs.reduce(
  (acc, config) => {
    acc.addresses.push(config.address);
    acc.map[config.address] = config;
    return acc;
  },
  { addresses: [], map: {} } as BroadcastConfigEntities
);
