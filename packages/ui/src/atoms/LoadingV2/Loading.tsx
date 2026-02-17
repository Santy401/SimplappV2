import LoadingBarModule from './styles.module.css'
import LoadingWaveModule from './styles.module.css'

export function Loading() {
    return (<div className='scale-[0.8]'>
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