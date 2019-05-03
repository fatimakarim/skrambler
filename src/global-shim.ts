/**
 * On version 6 of Angular CLI we are removing the shim for global and other node built-ins. 
 * You can read more about why this change was made in #9827 (comment).
 */
(window as any).global = window;