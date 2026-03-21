import LoadingBarModule from './styles.module.css'
import LoadingWaveModule from './styles.module.css'

export function LoadingV2({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const scale = size === 'sm' ? 'scale-[0.5]' : size === 'lg' ? 'scale-[1.2]' : 'scale-[0.8]';
    
    return (<div className={scale}>
        {/* <!-- From Uiverse.io by mrpumps31232 --> */}
        <div className={LoadingWaveModule.LoadingWave}>
            <div className={LoadingBarModule.LoadingBar}></div>
            <div className={LoadingBarModule.LoadingBar}></div>
            <div className={LoadingBarModule.LoadingBar}></div>
            <div className={LoadingBarModule.LoadingBar}></div>
        </div>

    </div>
    )
}