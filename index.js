import { Command } from 'commander';
import { SshStore } from './ssh-store.js';

const program = new Command();
const sshStore = new SshStore();

program
    .name('sshm')
    .option('-l, --list', '展示 ssh 列表')
    .option('-n, --new-ssh <ssh>', '新建 ssh 会话')
    .option('-u, --use-ssh <name>', '使用 ssh 会话')
    .option('-d, --del-ssh <name>', '删除 ssh 会话')
    .action(operate)
    .parse(process.argv);

function operate(options) {
    const args = Object.keys(options);
    if (!args.length) sshStore.select();

    const [param] = args;
    if (param === 'list') sshStore.display();
    else sshStore[param](options[param]);
}