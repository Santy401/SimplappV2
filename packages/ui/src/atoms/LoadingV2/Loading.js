import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import LoadingBarModule from './styles.module.css';
import LoadingWaveModule from './styles.module.css';
export function Loading() {
    return (_jsx("div", { className: 'scale-[0.8]', children: _jsxs("div", { className: LoadingWaveModule.LoadingWave, children: [_jsx("div", { className: LoadingBarModule.LoadingBar }), _jsx("div", { className: LoadingBarModule.LoadingBar }), _jsx("div", { className: LoadingBarModule.LoadingBar }), _jsx("div", { className: LoadingBarModule.LoadingBar })] }) }));
}
