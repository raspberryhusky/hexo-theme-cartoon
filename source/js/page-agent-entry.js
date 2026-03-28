import { PageAgent } from 'page-agent';
import { PageAgentCore } from '@page-agent/core';
import { PageController } from '@page-agent/page-controller';

// 暴露到全局，方便 EJS 模板中调用并实现自定义 UI
window.PageAgent = PageAgent;
window.PageAgentCore = PageAgentCore;
window.PageController = PageController;