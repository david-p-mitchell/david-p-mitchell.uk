<template>
    <div class="text-center">
        <div class="inline-block transition-transform duration-200 ease-in-out"
      :class="hovering && isFilterable ? 'scale-125 cursor-pointer' : 'scale-100 cursor-default'"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false">
    <svg xmlns="http://www.w3.org/2000/svg" :width="60.885 * iconScale" :height="30.358 * iconScale" viewBox="0 0 63.885 36.358" :class="isFilterable ? 'min-h-[110px]' : ''">
        <g transform="scale(0.5) translate(5,0)">
        <g id="Group_7" data-name="Group 7" transform="translate(-4.989 -3.558)">
            <g id="Group_4" data-name="Group 4" transform="translate(4.989 3.558)">
            <g id="Group_2" data-name="Group 2">
                <path id="Path_1" data-name="Path 1" d="M39.626,154.889,42.9,138.438l-.294-.218,6.023-1.31-.355.362-5.9,24.053.294.221-6.154,1.339.325-.357-5.99-21.47-.291-.22,5.99-1.3-.325.352,3.337,15.017Z" transform="translate(-30.56 -116.359)" fill="#383a3e"/>
                <path id="Path_2" data-name="Path 2" d="M149.4,120.343l.257-.343v5.668l-.287-.223-5.475,1.19v4.023L149.2,129.5v5.1l-5.309,1.156v4.053l5.959-1.292.291-.35v5.67l-.291-.22-11.461,2.488.291-.35V122.668Z" transform="translate(-119.145 -102.467)" fill="#383a3e"/>
                <path id="Path_3" data-name="Path 3" d="M216.733,109.54l-.291-.223,8.126-1.763c3.43-.746,6.247.544,6.247,4.5v4.624a5.964,5.964,0,0,1-2.458,5.058l3.171,7.391.291.223L225.7,130.68l.325-.352-2.234-6.388-1.845.4v6.871l.325.216L216.44,132.7l.291-.352V109.54Zm5.21,10.141,2.625-.568a1.319,1.319,0,0,0,1.032-1.208v-4.717a.785.785,0,0,0-1.032-.757l-2.625.573Z" transform="translate(-183.266 -92.077)" fill="#383a3e"/>
                <path id="Path_4" data-name="Path 4" d="M319.7,81.63v4.912l-4.5.978V105.7l.291.225-5.8,1.256.294-.35V88.649l-4.6,1V84.737Z" transform="translate(-256.34 -70.945)" fill="#383a3e"/>
                <path id="Path_5" data-name="Path 5" d="M405.88,94.4l.325.218L400.28,95.9l.327-.355v-22.8l-.327-.216,5.925-1.283-.325.35Z" transform="translate(-334.295 -62.409)" fill="#383a3e"/>
                <path id="Path_6" data-name="Path 6" d="M453.381,72.7a.789.789,0,0,0,1.035.76l5.54-1.2v5.1l-5.54,1.2c-3.464.753-6.247-1.371-6.247-4.73V62.653a8.08,8.08,0,0,1,6.247-7.469L459.7,54.04v5.1l-5.279,1.142a1.335,1.335,0,0,0-1.035,1.24Z" transform="translate(-373.638 -48.279)" fill="#383a3e"/>
                <path id="Path_7" data-name="Path 7" d="M534.08,56.98l-4.824,1.048-.9,3.746.287.22L522.62,63.3l.357-.362,5.895-24.053-.3-.221,6.154-1.335-.327.353,5.993,21.47.287.223-5.989,1.3.325-.361Zm-2.461-11.656-1.262,7.681,2.59-.564L531.683,45.3Z" transform="translate(-434.801 -34.551)" fill="#383a3e"/>
                <path id="Path_8" data-name="Path 8" d="M642.28,43.767l-11.82,2.565.294-.318V22.9l5.21-1.137V40.037l6.02-1.306v4.812Z" transform="translate(-523.395 -21.76)" fill="#383a3e"/>
            </g>
            <path id="Path_9" data-name="Path 9" d="M445.3,216.521l.261-.341v5.672l-.294-.223-5.472,1.189v4.019l5.313-1.155v5.1l-5.313,1.153v4.057l5.959-1.3.291-.346v5.67l-.291-.223-11.461,2.488.291-.344V218.853Z" transform="translate(-362.235 -181.482)" fill="#383a3e"/>
            <path id="Path_10" data-name="Path 10" d="M519.81,220.524l-4.824,1.048-.907,3.748.291.22-6.02,1.3.355-.355,5.891-24.051-.291-.227,6.152-1.331-.325.352,5.99,21.476.294.22-5.988,1.3.321-.352Zm-2.461-11.656-1.264,7.681,2.59-.557-1.262-7.139Z" transform="translate(-423.078 -168.912)" fill="#383a3e"/>
            <path id="Path_11" data-name="Path 11" d="M631.544,191.042a7.459,7.459,0,0,1-6.216,7.332l-2.072.453v6.141l.291.221-5.8,1.26.294-.35V183.3l-.294-.22,7.578-1.647c3.434-.744,6.216.33,6.216,4.733Zm-5.215-4.094a.778.778,0,0,0-1-.762l-2.072.45v7.442l2.072-.45a1.32,1.32,0,0,0,1-1.23Z" transform="translate(-512.953 -152.756)" fill="#383a3e"/>
            <g id="Group_3" data-name="Group 3" transform="translate(5.875 39.308)">
                <path id="Path_12" data-name="Path 12" d="M145.9,293.97l-32.591,7.076,1.936.464,32.591-7.075Z" transform="translate(-104.417 -284.697)" fill="#383a3e"/>
                <path id="Path_13" data-name="Path 13" d="M236.812,350.74l-17.181,3.728,1.936.468,17.18-3.73Z" transform="translate(-191.762 -331.335)" fill="#383a3e"/>
                <path id="Path_14" data-name="Path 14" d="M127.023,263.8v-4.817L121,260.285V242.01l-5.213,1.132v0l-34.524,7.492,1.472.359,15.529-3.373,1.936.466L115.79,244.7v2.179l1.562.378-1.562.339v3.68l3.123.757-3.123.678v1.333L63.48,265.4l1.471.357,17.776-3.86,1.936.466,31.127-6.757v1.46l3.123.757-3.123.68v4.4l1.562.378-1.562.337v1.337L98.528,268.7l1.472.359,8.529-1.852,1.935.464,5.038-1.092h0l11.813-2.563Z" transform="translate(-63.48 -242.01)" fill="#383a3e"/>
            </g>
            </g>
        </g>
        </g>
    </svg>
    </div>
    <p v-if="showName" class="text-center text-md font-medium">Vertical Leap</p>
    <p v-if="showTime" class="text-center text-sm text-gray-500">Software Engineer</p>
    <p v-if="showTime" class="text-center text-xs text-gray-500">January 2017 - March 2025</p>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

const hovering = ref(false);
    defineProps({
        iconScale: { type: Number, default: 1 },
        showName: { type: Boolean, default: false },
        showTime: { type: Boolean, default: false },
        showTitle: { type: Boolean, default: false },
        isFilterable: { type: Boolean, default: false }
    });
</script>
