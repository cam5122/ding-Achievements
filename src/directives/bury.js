import axios from 'axios'
import buryData from '@/utils/bury'

export default {
    bind (el, binding) {
        el.addEventListener('click', () => {
            buryData.buryData.questUrl = location.href
            buryData.buryData = Object.assign(buryData.buryData, binding.value)
            let base = 'https://test.dingteam.com/operative/'
            if (location.href.indexOf('https://okr.dingteam.com') > -1) {
                base = 'https://ding.dingteam.com/operativenew/'
            }
            axios({
                method: 'post',
                url: base + 'alid/app/operative/utilContrl/addBuryingPoint',
                data: buryData.buryData
            }).then(res => {
                console.log(res)
            })
        }, false)
    }
}
