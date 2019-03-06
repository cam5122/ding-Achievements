<template>
    <div class="input-form" @click="getInput">
        <textarea class="input" ref="input" @focus="getFocus" @blur="inputBlur" @input="getValue" :value="value" />
        <div class="input-text" ref="inputText" @click="getInput"  :class="{toUp: isToUp, toDown: isToDown}" :style="{transform:transformCurrrent}">
            <div v-if="this.require==1" class="green">*</div>
            <div class="fz" :style="{color:activeColor}">{{positionText}}</div>
        </div>
        <!-- ios上placeholder 有bug -->
        <div class="placeholder" v-if="this.isFocus && this.value === '' " :style="{left:isIOS?'22px':'18px'}">
            {{inputPlace}}
        </div>
    </div>
</template>

<script>
import autosize from "@/plugins/autosize.js";
export default {
    name: "InputText",
    props: {
        value: {
            defalut: ""
        }, //绑定的value
        title: {
            type: String,
            default: ""
        },
        inputPlace: {
            type: String,
            default: "请输入"
        }
    },
    data() {
        return {
            transformCurrrent: "",
            positionText: "",
            activeColor: "#191F25",
            require: 0,
            isToUp: false,
            isToDown: false,
            isFocus: false,
            isIOS: false
        };
    },
    mounted() {
        autosize(document.querySelectorAll("textarea"));
        if (
            navigator.userAgent.indexOf("iPhone") > -1 ||
            navigator.userAgent.indexOf("iPad") > -1
        ) {
            this.isIOS = true;
        }
    },
    created() {
        if (this.value !== "") {
            this.transformCurrrent = "translate(-3px,-28px) scale(0.8)";
        }
        let star = this.title.substr(0, 1);
        if (star == "*") {
            this.require = 1;
        }
        this.positionText = this.title.replace("*", "");
    },
    watch:{
        title(val){
            this.positionText = this.title.replace("*", "");
        }
    },
    methods: {
        getFocus() {
            setTimeout(() => {
                this.isFocus = true;
            }, 300);
            this.transformCurrrent = "translate(-3px,-28px) scale(0.8)";
            this.activeColor = "#3296FA";
            if (this.value === "") {
                this.isToDown = false;
                this.isToUp = true;
            } else {
                this.isToUp = false;
            }
        },
        inputBlur() {
            this.isFocus = false;
            if (this.value === "") {
                this.transformCurrrent = "translate(0,0) scale(1)";
                this.isToUp = false;
                this.isToDown = true;
                this.activeColor = "#191F25";
            } else {
                this.isToDown = false;
                this.activeColor = "rgba(25,31,37,0.56)";
            }
        },
        getInput() {
            //如果点击到占位符。让input获取焦点
            this.$refs.input.focus();
        },
        getValue(event) {
            let value = event.target.value;
            this.$emit("input", value);
        }
    }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
.input-form {
    position: relative;
    min-height: 75px;
    background-color: #fff;
    padding: 0 15px;
    .input {
        // height: 35px;
        // position: absolute;
        // top: 26px;
        // left: 18px;
        // font-size: 16px;
        // color: #191f25;
        // // line-height: 24px;
        // border: none;
        // outline: none;
        // resize: none;
        width: 100%;
        height: 35px;
        margin-top: 22px;
        font-size: 16px;
        color: #191f25;
        line-height: 24px;
        border: none;
        outline: none;
        resize: none;
        -webkit-tap-highlight-color: transparent;
        &:focus {
            color: #3296fa;
        }
    }

    .placeholder {
        position: absolute;
        top: 24px;
        left: 18px;
        font-size: 15px;
        color: rgba(25, 31, 37, 0.4);
    }

    .input-text {
        position: absolute;
        top: 30px;
        left: 15px;
        color: #c8c8c8;
        font-size: 32px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-bottom: 20px;
        .fz {
            font-size: 17px;
            line-height: 21px;
            color: #191f25;
        }

        .green {
            position: absolute;
            left: -10px;
            color: #f25643;
            font-size: 17px;
            line-height: 21px;
        }
    }
}
@keyframes fadeInUp {
    from {
        -webkit-transform: translate(0, 0) scale(1);
        transform: translate(0, 0) scale(1);
    }

    to {
        -webkit-transform: translate(-3px, -28px) scale(0.8);
        transform: translate(-3px, -28px) scale(0.8);
    }
}
@-webkit-keyframes fadeInUp {
    from {
        -webkit-transform: translate(0, 0) scale(1);
        transform: translate(0, 0) scale(1);
    }

    to {
        -webkit-transform: translate(-3px, -28px) scale(0.8);
        transform: translate(-3px, -28px) scale(0.8);
    }
}
@keyframes fadeInDown {
    from {
        -webkit-transform: translate(-3px, -28px) scale(0.8);
        transform: translate(-3px, -28px) scale(0.8);
    }

    to {
        -webkit-transform: translate(0, 0) scale(1);
        transform: translate(0, 0) scale(1);
    }
}
@-webkit-keyframes fadeInDown {
    from {
        -webkit-transform: translate(-3px, -28px) scale(0.8);
        transform: translate(-3px, -28px) scale(0.8);
    }

    to {
        -webkit-transform: translate(0, 0) scale(1);
        transform: translate(0, 0) scale(1);
    }
}
.toUp {
    animation: fadeInUp 0.3s;
    -webkit-animation: fadeInUp 0.3s; /* Safari 和 Chrome */
}
.toDown {
    animation: fadeInDown 0.3s infinite;
    -webkit-animation: fadeInDown 0.3s; /* Safari 和 Chrome */
}
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
    font-size: 15px;
    // line-height: 24px;
    color: rgba(25, 31, 37, 0.4);
}
</style>
