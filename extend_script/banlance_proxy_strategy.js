function main(config, profileName) {
  // Ensure proxy-groups and proxy-providers exist
  if (!config['proxy-groups']) {
    config['proxy-groups'] = [];
  }
  if (!config['proxy-providers']) {
    config['proxy-providers'] = {};
  }

  // Get all proxies from both direct proxies and providers
  const directProxies = config.proxies || [];
  const allDirectProxyNames = directProxies.map(proxy => proxy.name);
  
  // Collect proxy names from all providers
  let providerProxyNames = [];
  if (config['proxy-providers']) {
    for (const providerName in config['proxy-providers']) {
      const provider = config['proxy-providers'][providerName];
      if (provider && provider.proxies) {
        providerProxyNames = providerProxyNames.concat(provider.proxies);
      }
    }
  }
  
  // Combine all proxy names (direct + providers)
  const allProxies = [...new Set([...allDirectProxyNames, ...providerProxyNames])];

  // Create regex pattern to match unwanted nodes (GB, 重置, 到期)
  const unstableNodePattern = /gb|重置|到期|date|Days/i;
  
  // Filter proxies using regex test
  const stableProxies = allProxies.filter(proxyName => 
    !unstableNodePattern.test(proxyName)
  );

  // Create three load balancing groups with filtered proxies and icons
  const loadBalanceGroups = [
    {
      name: '🔀 Load-Balance-Robin',
      type: 'load-balance',
      proxies: stableProxies,
      strategy: 'round-robin',
      url: 'https://www.gstatic.com/generate_204',
      interval: 300,
      lazy: true,
    },
    {
      name: '⚖️ Load-Balance-Hashing',
      type: 'load-balance',
      proxies: stableProxies,
      strategy: 'consistent-hashing',
      url: 'https://www.gstatic.com/generate_204',
      interval: 300,
      lazy: true,
    },
    {
      name: '🎯 Load-Balance-Sessions',
      type: 'load-balance',
      proxies: stableProxies,
      strategy: 'sticky-sessions',
      url: 'https://www.gstatic.com/generate_204',
      interval: 300,
      lazy: true,
    }
  ];

  // Add load balancing groups to proxy-groups (insert at beginning)
  config['proxy-groups'] = [...loadBalanceGroups, ...config['proxy-groups']];

  // Find the default group (usually named 'PROXY' or first select group)
  let defaultGroup = config['proxy-groups'].find(
    group => group.name === 'PROXY' || group.type === 'select'
  ) || config['proxy-groups'][0];

  // Add load balancing groups to the beginning of default group's proxies
  if (defaultGroup && defaultGroup.proxies) {
    const groupNames = loadBalanceGroups.map(group => group.name);
    defaultGroup.proxies = [...groupNames, ...defaultGroup.proxies];
  }

  return config;
}
