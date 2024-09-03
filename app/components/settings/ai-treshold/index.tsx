import React from 'react';
import SettingRow from "@/app/components/settings/ui/setting-row";
import axios from "axios";

const AiThresholdSetting = () => {

    const fetchFunc = async () => {
        const data = await axios.get('/api/settings/ai-threshold')
        console.log(data)
        return data.data.ai_threshold
    }

    const updateFunc = async (ai_threshold: string) => {
        const data = await axios.post('/api/settings/ai-threshold', {
            ai_threshold: ai_threshold
        })
        console.log(data)
    }

    return (
        <SettingRow setting_name={'AI threshold'} fetchFunc={fetchFunc} min={0.1} max={1} step={0.1} type={'number'}
                    updateFunc={updateFunc} description={'Отвечает за точность поиска статей искусственным интеллектом.\nСтандартное значение - 0.3'}/>
    );
};

export default AiThresholdSetting;