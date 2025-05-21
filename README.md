# ClashProfileEnhance
Clash extend config and extend script

## 扩展脚本

### 功能说明

为Clash配置文件添加三种负载均衡策略组（轮询、一致性哈希、会话保持），并自动过滤掉名称包含"GB"、"重置"或"到期"的不稳定节点。特性包括自动识别所有代理节点（包括直接代理和代理提供商）、智能添加到默认代理组，并确保负载均衡组使用稳定的节点。

### 使用方法
1. 在 Clash Verge Rev 中打开 `订阅` 页面
2. 点击 `全局扩展脚本` 按钮
3. 将 [`Scripts.js`](./Script.js) 文件中的内容复制到编辑器中
4. 保存并应用更改

