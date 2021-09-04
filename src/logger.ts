import chalk from 'chalk';
const log = console.log;

export function error(value){
  return log(chalk.red(value));
}

export function warn(value){
  return log(chalk.yellow(value));
}

export function notify(value){
  return log(chalk.cyan(value));
}

export function success(value){
  return log(chalk.green(value));
}