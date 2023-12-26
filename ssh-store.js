import fs from 'fs-extra';
import { spawn } from 'child_process';
import { select } from '@inquirer/prompts';

export class SshStore {

    constructor() {
        const { sessions } = fs.readJsonSync('D:/code/sshm/ssh-sessions.json');
        this.sessions = sessions;
    }

    #save() {
        fs.writeJsonSync('D:/code/sshm/ssh-sessions.json', { sessions: this.sessions })
    }

    #excute(cmd) {
        const child = spawn(cmd, {
            shell: true,
            stdio: 'inherit'
        });

        child.on('exit', (code, signal) => {
            console.log(`子进程退出，退出码：${code}，信号：${signal}`);
        });
    }

    async select() {
        const answer = await select({ message: '选择一个 ssh 会话：', choices: this.sessions });
        this.#excute(answer);
    }

    display() {
        if (!this.sessions.length) {
            console.log('无');
            return;
        }

        this.sessions.forEach((session, index) => console.log(`${index + 1}) ${session.name}`));
    }

    newSsh(value) {
        const name = value.split('.').pop();

        const session = this.sessions.find(s => s.name === name);
        if (session) {
            console.log('已存在');
            return;
        }

        this.sessions.push({ name, value: `ssh ${value}` });
        this.#save();
    }

    useSsh(value) {
        const session = this.sessions.find(s => s.name === value);
        if (!session) {
            console.log('不存在');
            return;
        }

        this.#excute(session.value);
    }

    delSsh(value) {
        const session = this.sessions.find(s => s.name === value);
        if (!session) {
            console.log('不存在');
            return;
        }

        this.sessions = this.sessions.filter(s => s.name !== value);
        this.#save();
    }
}