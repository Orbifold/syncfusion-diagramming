<template>
  <div>
    <div class="header">
      <div class="logo"><img title="Orbifold Consulting"
                             src="/logo.png"
                             style="width: 50px; margin: 0px 0 0 20px;"
                             alt="Orbifold"></div>
      <div class="title-wrapper">
        <div class="title">Ocean South Chart</div>
        <v-spacer></v-spacer>
        <v-icon title="Edit Title"
                class="pencil">mdi-pencil
        </v-icon>
      </div>
      <div class="toolbar">
        <v-btn @click="layout"
               icon
               small
               title="Layout">
          <v-icon>mdi-graph-outline</v-icon>
        </v-btn>
        <v-btn @click="addBasic"
               icon
               small
               title="Add Node">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn @click="toggleOverview"
               icon
               small
               title="Toggle Overview Panel">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="diagram-wrapper">
      <ejs-contextmenu ref="ctx"
                       :items="contextItems"
                       class="context-menu"></ejs-contextmenu>

      <div class="left-panel">
        <div class="search">
          <button class="search-button">
            <img title="Search"
                 src="/search.svg"
                 alt="">
          </button>
        </div>
        <div class="palette">
          <ejs-symbolpalette id="symbolpalette"
                             :expandMode='expandMode'
                             :getNodeDefaults='palettegetNodeDefaults'
                             :getSymbolInfo='getSymbolInfo'
                             :height='paletteHeight'
                             :palettes='palettes'
                             :symbolHeight='symbolHeight'
                             :symbolMargin='symbolMargin'
                             :symbolWidth='symbolWidth'

                             :width='paletteWidth'></ejs-symbolpalette>
        </div>


      </div>
      <ejs-diagram id="diagram"
                   ref="diagram"
                   :click="diagramClick"
                   :connectors='connectors'
                   :dragEnter='dragEnter'
                   :drop="onDrop"
                   :getConnectorDefaults='getConnectorDefaults'
                   :getNodeDefaults='getNodeDefaults'
                   :height='height'
                   :layout="layoutDefinition"
                   :tool="tool"
                   :scrollChange="scrollChange"
                   :nodes='nodes'
                   :selectedItems="selectedItems"
                   :snapSettings='snapSettings'
                   :collectionChange="onConnectionChange"
                   :width='width'
                   :keyDown="keyDown"
                   :keyUp="keyUp"
                   style='display:block'
      ></ejs-diagram>
      <div class="overview-panel"
           v-show="overviewVisible">
        <ejs-overview id="overview"
                      style=" top:30px;"
                      :sourceID='overviewsourceID'
                      :width='overviewWidth'
                      :height='overviewHeight'></ejs-overview>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import faker from "faker";
import _ from "lodash"
import {
  Diagram,
  NodeModel,
  Node,
  Connector,
  PortVisibility,
  ConnectorEditing,
  DataBinding,
  SnapConstraints,
  SnapSettingsModel,
  DiagramContextMenu,
  Snapping,
  NodeConstraints,
  UndoRedo,
  SelectorConstraints,
  DiagramTools,
  ZoomPanTool,
  ConnectionPointOrigin,
  PortConstraints,
  ComplexHierarchicalTree,
  LineDistribution,
  LayoutOrientation
} from "@syncfusion/ej2-vue-diagrams";
import {ContextMenuComponent} from "@syncfusion/ej2-vue-navigations";

const blue = "#2e4472";
const dimgrey = "#696969"
const font = "Lato, Roboto";
const CompanySvg = `<svg width="50" height="50"   fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M12 7V5C12 3.9 11.1 3 10 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM19 19H12V17H14V15H12V13H14V11H12V9H19C19.55 9 20 9.45 20 10V18C20 18.55 19.55 19 19 19ZM18 11H16V13H18V11ZM18 15H16V17H18V15Z" fill="#050C42"/></g></svg>`;
const IndividualSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#050C42"/></svg>`;
const TrustSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.00003 5V5.38C8.17003 5.05 7.28003 4.88 6.39003 4.88C4.97003 4.88 3.55003 5.31 2.34003 6.17C1.83003 6.53 1.77003 7.26 2.21003 7.7L4.78003 10.27H5.89003V11.38C6.75003 12.24 7.87003 12.69 9.00003 12.74V15H7.00003C6.45003 15 6.00003 15.45 6.00003 16V18C6.00003 19.1 6.90003 20 8.00003 20H18C19.66 20 21 18.66 21 17V5C21 4.45 20.55 4 20 4H10C9.45003 4 9.00003 4.45 9.00003 5ZM7.89003 10.41V8.26H5.61003L4.57003 7.22C5.14003 7 5.76003 6.88 6.39003 6.88C7.73003 6.88 8.98003 7.4 9.93003 8.34L11.34 9.75L11.14 9.95C10.63 10.46 9.95003 10.75 9.22003 10.75C8.75003 10.75 8.29003 10.63 7.89003 10.41ZM19 17C19 17.55 18.55 18 18 18C17.45 18 17 17.55 17 17V16C17 15.45 16.55 15 16 15H11V12.41C11.57 12.18 12.1 11.84 12.56 11.38L12.76 11.18L15.59 14H17V12.59L11 6.62V6H19V17Z" fill="#050C42"/></svg>`;
const AssetSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.4831 18.8512V19.5037C13.4831 20.325 12.809 21 11.9888 21H11.9775C11.1573 21 10.4831 20.325 10.4831 19.5037V18.8287C8.98876 18.5138 7.66292 17.6925 7.10112 16.3088C6.8427 15.69 7.32584 15.0037 8 15.0037H8.26966C8.68539 15.0037 9.02247 15.285 9.17977 15.6788C9.50562 16.5225 10.3596 17.1075 12 17.1075C14.2022 17.1075 14.6966 16.005 14.6966 15.3187C14.6966 14.385 14.2022 13.5075 11.6966 12.9113C8.91011 12.2363 7 11.0887 7 8.7825C7 6.8475 8.5618 5.5875 10.4944 5.17125V4.49625C10.4944 3.675 11.1685 3 11.9888 3H12C12.8202 3 13.4944 3.675 13.4944 4.49625V5.19375C15.0449 5.57625 16.0225 6.54375 16.4494 7.73625C16.6742 8.355 16.2022 9.0075 15.5393 9.0075H15.2472C14.8315 9.0075 14.4944 8.715 14.382 8.31C14.1236 7.455 13.4157 6.90375 12 6.90375C10.3146 6.90375 9.30337 7.66875 9.30337 8.74875C9.30337 9.69375 10.0337 10.3125 12.3034 10.8975C14.573 11.4825 17 12.4613 17 15.2963C16.9775 17.355 15.4382 18.48 13.4831 18.8512Z" fill="#050C42"/></svg>`;
const ProjectSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17ZM19.5 19.1H4.5V5H19.5V19.1ZM19.5 3H4.5C3.4 3 2.5 3.9 2.5 5V19C2.5 20.1 3.4 21 4.5 21H19.5C20.6 21 21.5 20.1 21.5 19V5C21.5 3.9 20.6 3 19.5 3Z" fill="#050C42"/></svg>`;
const CustomSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="2.5" width="8" height="8" rx="0.5" stroke="#050C42"/><rect x="13.5" y="2.5" width="8" height="8" rx="0.5" stroke="#050C42"/><rect x="13.5" y="13.5" width="8" height="8" rx="0.5" stroke="#050C42"/><rect x="2.5" y="13.5" width="8" height="8" rx="0.5" stroke="#050C42"/></svg>`;

Diagram.Inject(Snapping);
Diagram.Inject(DiagramContextMenu);
Diagram.Inject(UndoRedo);
@Component({
  provide: {
    diagram: [DataBinding, ComplexHierarchicalTree, ConnectorEditing]
  },
})
export default class diagram1 extends Vue {
  onConnectionChange(e) {

    if (e.element.type === "Straight") {
      if (e.element.targetID === "") {
        e.cancel = true;
      }
    }
  }

  overviewsourceID: string = "diagram"
  symbolPreview: any = {
    width: "50px",
    height: "50px"
  }
  overviewWidth: string = "100%"
  overviewHeight: string = "150px"

  keyDown(e) {
    if (e.key === " ") {
      this.tool = DiagramTools.ZoomPan;
    }
  }

  keyUp(e) {
    // console.log("done")
  }

  isMobile: boolean = false;
  tool: any = DiagramTools.MultipleSelect | DiagramTools.DrawOnce | DiagramTools.SingleSelect;
  contextItems: any[] = [
    {
      text: "Info",
      iconCss: "mdi mdi-information-outline"
    },
    {
      text: "View Files",
      iconCss: "mdi mdi-folder"
    },
    {
      text: "Add Files",
      iconCss: "mdi mdi-folder-plus"
    }
  ]


  nodes: any = [];
  connectors: any[] = [];
  globevent: any = null;
  flowshapes: any[] = [

    {
      id: "Company", shape: {
        type: "Native",
        content: CompanySvg
      }
    },
    {
      id: "Individual", shape: {
        type: "Native",
        content: IndividualSvg
      }
    },
    {
      id: "Trust", shape: {
        type: "Native",
        content: TrustSvg
      }
    },
    {
      id: "Asset", shape: {
        type: "Native",
        content: AssetSvg
      }
    },
    {
      id: "Project", shape: {
        type: "Native",
        content: ProjectSvg
      }
    },
    {
      id: "Custom", shape: {
        type: "Native",
        content: CustomSvg
      }
    },

  ];

  width: string = "100%"
  height: string = "100%"
  selectedItems: any = {
    constraints: SelectorConstraints.UserHandle,
    userHandles: []
  }

  snapSettings: any = {
    horizontalGridlines: {lineColor: "#cdcdcd", dotIntervals: [0.95, 20.75], lineIntervals: [0.95, 20.75], snapIntervals: [10]},
    verticalGridlines: {lineColor: "#cdcdcd", dotIntervals: [0.95, 20.75], lineIntervals: [0.95, 20.75], snapIntervals: [10]},
    gridType: "Dots",

    constraints: SnapConstraints.SnapToLines | SnapConstraints.ShowLines
  }
  layoutDefinition: any = {
    type: "ComplexHierarchicalTree",
    connectionPointOrigin: ConnectionPointOrigin.DifferentPoint,
    horizontalSpacing: 40,
    verticalSpacing: 50,
    orientation: "LeftToRight",
    margin: {left: 10, right: 0, top: 50, bottom: 0}
  }
  contextmenu: ContextMenuComponent;
  expandMode: string = "Multiple"
  palettes: any[] = [
    {
      id: "shapes",
      expanded: true,
      symbols: this.flowshapes,
      iconCss: "shapes",
      title: ""
    }
  ]
  paletteWidth: string = "100%"
  paletteHeight: string = "100%"
  symbolHeight: number = 50
  symbolWidth: number = 50

  symbolMargin: any = {left: 15, right: 15, top: 15, bottom: 15}

  get diagram() {
    return (this.$refs.diagram as any)["ej2Instances"];
  }

  layout() {
    this.diagram.doLayout();
    this.diagram.fitToPage();
  }

  addPath() {
    this.diagram.addNode({
      offsetX: _.floor(Math.random() * this.diagram.element.clientWidth),
      offsetY: _.floor(Math.random() * this.diagram.element.clientHeight),
      // Size of the node
      width: 200,
      height: 100,
      //sets the type of the shape as Path
      shape: {
        type: "Path",
        data: "m49.41081,23.36145c-0.31115,-0.9574 -1.33946,-1.48148 -2.29686,-1.17033c-0.22157,0.07189 -0.4184,0.18366 -0.5887,0.32254l-8.32766,-2.37857l5.98778,-1.94545c0.46593,0.39384 1.1175,0.54647 1.74037,0.34415c0.95741,-0.31095 1.48148,-1.33926 1.17033,-2.29686c-0.31115,-0.9574 -1.33926,-1.48148 -2.29686,-1.17033c-0.62131,0.20193 -1.05817,0.70636 -1.2047,1.29683l-6.06616,1.97098l5.24999,-6.85777c0.27068,0.04066 0.55452,0.02279 0.83247,-0.06757c0.9574,-0.31114 1.48148,-1.33926 1.17033,-2.29686s-1.33926,-1.48148 -2.29686,-1.17033c-0.95583,0.31056 -1.47932,1.33592 -1.17171,2.29195l-5.84812,7.63898c-0.23198,-0.00196 -0.46809,0.03104 -0.70106,0.10666c-0.81067,0.26341 -1.36323,0.9519 -1.49405,1.73861l-6.57177,2.1352c-0.26459,-0.3137 -0.60324,-0.56199 -0.98942,-0.71913l0,-6.90885c0.73759,-0.35731 1.24753,-1.11081 1.24753,-1.98532c0,-0.26695 -0.04989,-0.52172 -0.13671,-0.75861l5.26099,-7.84287c0.05264,0.00452 0.10548,0.00805 0.15931,0.00805c1.0069,0 1.82327,-0.81636 1.82327,-1.82326s-0.81636,-1.82327 -1.82327,-1.82327s-1.82327,0.81636 -1.82327,1.82327c0,0.23415 0.04577,0.45709 0.12611,0.66256l-4.83395,7.20624l0,-6.32054c0.51779,-0.32156 0.8637,-0.89376 0.8637,-1.54826c0,-1.0069 -0.81636,-1.82327 -1.82327,-1.82327c-1.0069,0 -1.82327,0.81636 -1.82327,1.82327c0,0.65431 0.34591,1.22651 0.8637,1.54826l0,6.38595l-4.89995,-7.12237c0.12198,-0.24475 0.1925,-0.51975 0.1925,-0.81165c0,-1.0069 -0.81636,-1.82327 -1.82327,-1.82327s-1.82327,0.81636 -1.82327,1.82327c0,1.00592 0.81479,1.8215 1.82051,1.82307l5.41185,7.86585c-0.07975,0.22806 -0.12532,0.47222 -0.12532,0.72758c0,0.87451 0.50993,1.62801 1.24753,1.98532l0,6.90924c-0.38599,0.15714 -0.72483,0.40543 -0.98942,0.71913l-6.56941,-2.13461c-0.12984,-0.78788 -0.6826,-1.47794 -1.49444,-1.74175c-0.24475,-0.07956 -0.49284,-0.11138 -0.73622,-0.10548l-5.8713,-7.48478c0.02082,-0.04891 0.04046,-0.09841 0.05716,-0.15007c0.31115,-0.9574 -0.21293,-1.98571 -1.17033,-2.29686c-0.9574,-0.31115 -1.98571,0.21293 -2.29686,1.17033c-0.31095,0.9574 0.21293,1.98571 1.17033,2.29686c0.22197,0.07209 0.44747,0.09763 0.66727,0.08486l5.35135,6.82202l-6.00114,-1.94996c-0.14575,-0.59184 -0.58301,-1.09785 -1.20549,-1.29998c-0.9574,-0.31115 -1.98571,0.21293 -2.29686,1.17033s0.21293,1.98571 1.17033,2.29686c0.6217,0.20193 1.27208,0.05029 1.73782,-0.34199l6.04986,1.96568l-8.26441,2.46618c-0.19466,-0.19113 -0.43411,-0.34258 -0.71127,-0.43254c-0.9574,-0.31115 -1.98571,0.21293 -2.29686,1.17033s0.21293,1.98572 1.17033,2.29686c0.95681,0.31075 1.98414,-0.21234 2.29607,-1.16837l9.09158,-2.7127c0.20861,0.17286 0.4514,0.31134 0.72463,0.40013c0.85113,0.27658 1.74725,0.00648 2.31297,-0.61483l6.52306,2.11948c0.03025,0.42468 0.16422,0.8197 0.37715,1.16149l-4.08339,5.62046c-0.78827,-0.11805 -1.61328,0.19466 -2.11418,0.88394c-0.14477,0.19918 -0.24947,0.41486 -0.3192,0.63761l-8.92402,3.26938c-0.03968,-0.03457 -0.08034,-0.06836 -0.12375,-0.09978c-0.8146,-0.59184 -1.95468,-0.41133 -2.54652,0.40327c-0.59184,0.8146 -0.41132,1.95468 0.40327,2.54652c0.8146,0.59184 1.95468,0.41132 2.54652,-0.40327c0.1375,-0.18936 0.23159,-0.39659 0.28757,-0.61011l8.14302,-2.98338l-3.71175,5.10876c-0.60776,-0.044 -1.22376,0.21548 -1.60837,0.74486c-0.59184,0.81459 -0.41133,1.95468 0.40327,2.54652s1.95468,0.41133 2.54652,-0.40327c0.38461,-0.52938 0.44118,-1.19548 0.21136,-1.76002l3.74455,-5.15394l-0.21332,8.62997c-0.2422,0.12611 -0.46063,0.30722 -0.63211,0.54313c-0.59184,0.8146 -0.41133,1.95468 0.40327,2.54652c0.81459,0.59185 1.95468,0.41132 2.54652,-0.40327c0.59126,-0.81381 0.41152,-1.95271 -0.40131,-2.54495l0.23415,-9.4701c0.21961,-0.143 0.4184,-0.32568 0.58163,-0.5502c0.52722,-0.72562 0.54647,-1.66357 0.12788,-2.39449l4.05137,-5.57626c0.19604,0.04832 0.39973,0.07661 0.6107,0.07661c0.21096,0 0.41466,-0.02848 0.6107,-0.07661l4.06434,5.59433c-0.40701,0.72797 -0.38383,1.65571 0.13848,2.37465c0.13652,0.18798 0.2974,0.34748 0.47477,0.4785l0.44393,9.45812c-0.04223,0.02573 -0.08447,0.05205 -0.12532,0.08171c-0.81459,0.59184 -0.99512,1.73193 -0.40327,2.54652c0.59184,0.81459 1.73193,0.99511 2.54652,0.40327c0.81459,-0.59185 0.99511,-1.73193 0.40327,-2.54652c-0.13947,-0.19191 -0.31016,-0.34729 -0.49913,-0.46711l-0.4129,-8.79634l3.81055,5.24488c-0.22923,0.56435 -0.17266,1.23005 0.21175,1.75903c0.59185,0.8146 1.73193,0.99511 2.54652,0.40327c0.8146,-0.59185 0.99512,-1.73193 0.40327,-2.54652c-0.38481,-0.52958 -1.0014,-0.78926 -1.60955,-0.74467l-3.7145,-5.11269l8.11375,2.8337c0.04557,0.26773 0.15007,0.52938 0.32038,0.76392c0.59185,0.81459 1.73193,0.99512 2.54652,0.40327c0.8146,-0.59184 0.99512,-1.73193 0.40327,-2.54652c-0.59184,-0.8146 -1.73193,-0.99512 -2.54652,-0.40327c-0.00059,0.00059 -0.00118,0.00098 -0.00196,0.00157l-9.01517,-3.14858c-0.06953,-0.23061 -0.176,-0.45414 -0.32568,-0.66c-0.50561,-0.69576 -1.34142,-1.00729 -2.13618,-0.88001l-4.08496,-5.62262c0.21293,-0.34179 0.3469,-0.73681 0.37715,-1.16149l6.52266,-2.11929c0.56572,0.62288 1.46301,0.89396 2.31532,0.61699c0.28542,-0.09272 0.53862,-0.23847 0.75312,-0.42233l9.02106,2.57658c0.01198,0.05225 0.02534,0.1045 0.04223,0.15656c0.31114,0.9574 1.33926,1.48148 2.29686,1.17033c0.9574,-0.31115 1.48148,-1.33926 1.17033,-2.29686z"
      },
    })
  }

  getShape() {
    return {

      // Size of the node
      width: 230,
      height: 80,
      //sets the type of the shape as Basic
      shape: {
        type: "Basic",
        shape: "Rectangle",
        cornerRadius: 10
      },
      style: {
        fill: "#ffffff",
        strokeColor: blue,
        strokeWidth: 2
      },
      annotations: [
        {
          template: "",
          width: 12,
          height: 12,
          offset: {x: 0.1, y: 0.4},
        },
        {
          content: faker.name.findName(),
          style: {color: blue, fontFamily: font, fontSize: 15},
          margin: {left: 25, right: 25}
        },
        {
          content: faker.name.jobTitle(),
          style: {color: dimgrey, fontFamily: font, fontSize: 10},
          margin: {left: 25, right: 25},
          offset: {x: 0.5, y: 0.8},
        },
        {
          template: "<div  class='dots'><span class='aha'>...</span></div>",
          width: 12,
          height: 12,
          offset: {x: 0.9, y: 0.4},
        }
      ]
    }
  }

  addBasic(p: any = null) {
    const shape: any = this.getShape()
    if (_.isNil(p)) {
      shape.offsetX = _.floor(Math.random() * this.diagram.element.clientWidth)
      shape.offsetY = _.floor(Math.random() * this.diagram.element.clientHeight)
    } else {
      shape.offsetX = p.x
      shape.offsetY = p.y
      shape.offsetY = p.y
    }
    this.diagram.addNode(shape)
    this.listenToDots()
  }

  overviewVisible: boolean = true;

  toggleOverview() {
    this.overviewVisible = !this.overviewVisible;

  }

  listenToDots() {
    const els = document.getElementsByClassName("aha")
    const self = this;
    Array.from(els).forEach((el) => {
      (el as any).onclick = (e) => {
        self.globevent = e;
        (self.$refs.ctx as any).open(e.pageY, e.pageX + pageXOffset);
      }
    });
  }

  addSvg() {
    this.diagram.addNode({
      // Position of the node
      offsetX: _.floor(Math.random() * this.diagram.element.clientWidth),
      offsetY: _.floor(Math.random() * this.diagram.element.clientHeight),
      // Size of the node
      width: 100,
      height: 100,
      //sets the type of the shape as Native
      shape: {
        type: "Native",
        content: "<g xmlns=\"http://www.w3.org/2000/svg\"> <g transform=\"translate(1 1)\"><g>	   <path style=\"fill:#61443C;\" d=\"M61.979,435.057c2.645-0.512,5.291-0.853,7.936-1.109c-2.01,1.33-4.472,             1.791-6.827,1.28 C62.726,435.13,62.354,435.072,61.979,435.057z\"/><path style=\"fill:#61443C;\"d=\"M502.469,502.471h-25.6c0.163-30.757-20.173-57.861-49.749-66.304 c-5.784-1.581-11.753-2.385-17.749-2.389c-2.425-0.028-4.849,0.114-7.253,0.427c1.831-7.63,2.747-15.45,2.731-23.296 c0.377-47.729-34.52-88.418-81.749-95.317c4.274-0.545,8.577-0.83,12.885-0.853c25.285,0.211,49.448,10.466,67.167,28.504 c17.719,18.039,27.539,42.382,27.297,67.666c0.017,7.846-0.9,15.666-2.731,23.296c2.405-0.312,4.829-0.455,7.253-0.427     C472.572,434.123,502.783,464.869,502.469,502.471z\"/>		</g>	<path style=\"fill:#8B685A;\" d=\"M476.869,502.471H7.536c-0.191-32.558,22.574-60.747,54.443-67.413    c0.375,0.015,0.747,0.072,1.109,0.171c2.355,0.511,4.817,0.05,6.827-1.28c1.707-0.085,3.413-0.171,5.12-0.171    c4.59,0,9.166,0.486,13.653,1.451c2.324,0.559,4.775,0.147,6.787-1.141c2.013-1.288,3.414-3.341,3.879-5.685    c7.68-39.706,39.605-70.228,79.616-76.117c4.325-0.616,8.687-0.929,13.056-0.939c13.281-0.016,26.409,2.837,38.485,8.363    c3.917,1.823,7.708,3.904,11.349,6.229c2.039,1.304,4.527,1.705,6.872,1.106c2.345-0.598,4.337-2.142,5.502-4.264    c14.373-25.502,39.733-42.923,68.693-47.189h0.171c47.229,6.899,82.127,47.588,81.749,95.317c0.017,7.846-0.9,15.666-2.731,23.296    c2.405-0.312,4.829-0.455,7.253-0.427c5.996,0.005,11.965,0.808,17.749,2.389C456.696,444.61,477.033,471.713,476.869,502.471    L476.869,502.471z\"/>		<path style=\"fill:#66993E;\" d=\"M502.469,7.537c0,0-6.997,264.96-192.512,252.245c-20.217-1.549-40.166-5.59-59.392-12.032    c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144c-6.656-34.048-25.088-198.997,231.765-230.144    C485.061,9.159,493.595,8.22,502.469,7.537z\"/>		<path style=\"fill:#9ACA5C;\" d=\"M476.784,10.183c-1.28,26.197-16.213,238.165-166.827,249.6    c-20.217-1.549-40.166-5.59-59.392-12.032c-1.365-0.341-2.731-0.853-4.096-1.28c0,0-0.597-2.219-1.451-6.144    C238.363,206.279,219.931,41.329,476.784,10.183z\"/>		<path style=\"fill:#66993E;\" d=\"M206.192,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-21.505,7.427-44.293,10.417-66.987,8.789C21.104,252.103,8.816,94.236,7.621,71.452c-0.085-1.792-0.085-2.731-0.085-2.731    C222.747,86.129,211.653,216.689,206.192,246.727z\"/>		<path style=\"fill:#9ACA5C;\" d=\"M180.336,246.727c-0.768,3.925-1.365,6.144-1.365,6.144c-1.365,0.427-2.731,0.939-4.096,1.28    c-13.351,4.412-27.142,7.359-41.131,8.789C21.104,252.103,8.816,94.236,7.621,71.452    C195.952,96.881,185.541,217.969,180.336,246.727z\"/>	</g>	<g>		<path d=\"M162.136,426.671c3.451-0.001,6.562-2.08,7.882-5.268s0.591-6.858-1.849-9.298l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    C157.701,425.773,159.872,426.673,162.136,426.671L162.136,426.671z\"/>		<path d=\"M292.636,398.57c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054s-3.335,8.671-0.054,12.012L292.636,398.57z\"/>		<path d=\"M296.169,454.771c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012L296.169,454.771z\"/>		<path d=\"M386.503,475.37c3.341,3.281,8.701,3.256,12.012-0.054c3.311-3.311,3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L386.503,475.37z\"/>		<path d=\"M204.803,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C198.241,407.524,201.352,409.603,204.803,409.604z\"/>		<path d=\"M332.803,443.737c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C326.241,441.658,329.352,443.737,332.803,443.737z\"/>		<path d=\"M341.336,366.937c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C334.774,364.858,337.885,366.937,341.336,366.937z\"/>		<path d=\"M164.636,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C173.337,451.515,167.977,451.49,164.636,454.771L164.636,454.771z\"/>		<path d=\"M232.903,429.171l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C241.604,425.915,236.243,425.89,232.903,429.171L232.903,429.171z\"/>		<path d=\"M384.003,409.604c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    c-3.311-3.311-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298    C377.441,407.524,380.552,409.603,384.003,409.604z\"/>		<path d=\"M70.77,463.304l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271s3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C79.47,460.048,74.11,460.024,70.77,463.304L70.77,463.304z\"/>		<path d=\"M121.97,446.238l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C130.67,442.981,125.31,442.957,121.97,446.238L121.97,446.238z\"/>		<path d=\"M202.302,420.638c-1.6-1.601-3.77-2.5-6.033-2.5c-2.263,0-4.433,0.899-6.033,2.5l-8.533,8.533    c-2.178,2.151-3.037,5.304-2.251,8.262c0.786,2.958,3.097,5.269,6.055,6.055c2.958,0.786,6.111-0.073,8.262-2.251l8.533-8.533    c1.601-1.6,2.5-3.77,2.5-6.033C204.802,424.408,203.903,422.237,202.302,420.638L202.302,420.638z\"/>		<path d=\"M210.836,463.304c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012l8.533,8.533    c2.149,2.188,5.307,3.055,8.271,2.27c2.965-0.785,5.28-3.1,6.065-6.065c0.785-2.965-0.082-6.122-2.27-8.271L210.836,463.304z\"/>		<path d=\"M343.836,454.771l-8.533,8.533c-2.188,2.149-3.055,5.307-2.27,8.271c0.785,2.965,3.1,5.28,6.065,6.065    c2.965,0.785,6.122-0.082,8.271-2.27l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    C352.537,451.515,347.177,451.49,343.836,454.771L343.836,454.771z\"/>		<path d=\"M429.17,483.904c3.341,3.281,8.701,3.256,12.012-0.054s3.335-8.671,0.054-12.012l-8.533-8.533    c-3.341-3.281-8.701-3.256-12.012,0.054c-3.311,3.311-3.335,8.671-0.054,12.012L429.17,483.904z\"/>		<path d=\"M341.336,401.071c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.441-3.169,6.11-1.849,9.298C334.774,398.991,337.885,401.07,341.336,401.071z\"/>		<path d=\"M273.069,435.204c2.264,0.003,4.435-0.897,6.033-2.5l8.533-8.533c3.281-3.341,3.256-8.701-0.054-12.012    s-8.671-3.335-12.012-0.054l-8.533,8.533c-2.44,2.44-3.169,6.11-1.849,9.298C266.508,433.124,269.618,435.203,273.069,435.204z\"/>		<path d=\"M253.318,258.138c22.738,7.382,46.448,11.338,70.351,11.737c31.602,0.543,62.581-8.828,88.583-26.796    c94.225-65.725,99.567-227.462,99.75-234.317c0.059-2.421-0.91-4.754-2.667-6.421c-1.751-1.679-4.141-2.52-6.558-2.308    C387.311,9.396,307.586,44.542,265.819,104.5c-28.443,42.151-38.198,94.184-26.956,143.776c-3.411,8.366-6.04,17.03-7.852,25.881    c-4.581-7.691-9.996-14.854-16.147-21.358c8.023-38.158,0.241-77.939-21.57-110.261C160.753,95.829,98.828,68.458,9.228,61.196    c-2.417-0.214-4.808,0.628-6.558,2.308c-1.757,1.667-2.726,4-2.667,6.421c0.142,5.321,4.292,130.929,77.717,182.142    c20.358,14.081,44.617,21.428,69.367,21.008c18.624-0.309,37.097-3.388,54.814-9.138c11.69,12.508,20.523,27.407,25.889,43.665    c0.149,15.133,2.158,30.19,5.982,44.832c-12.842-5.666-26.723-8.595-40.759-8.6c-49.449,0.497-91.788,35.567-101.483,84.058    c-5.094-1.093-10.29-1.641-15.5-1.638c-42.295,0.38-76.303,34.921-76.025,77.217c-0.001,2.263,0.898,4.434,2.499,6.035    c1.6,1.6,3.771,2.499,6.035,2.499h494.933c2.263,0.001,4.434-0.898,6.035-2.499c1.6-1.6,2.499-3.771,2.499-6.035    c0.249-41.103-31.914-75.112-72.967-77.154c0.65-4.78,0.975-9.598,0.975-14.421c0.914-45.674-28.469-86.455-72.083-100.045    c-43.615-13.59-90.962,3.282-116.154,41.391C242.252,322.17,242.793,288.884,253.318,258.138L253.318,258.138z M87.519,238.092    c-55.35-38.567-67.358-129.25-69.833-158.996c78.8,7.921,133.092,32.454,161.458,72.992    c15.333,22.503,22.859,49.414,21.423,76.606c-23.253-35.362-77.83-105.726-162.473-140.577c-2.82-1.165-6.048-0.736-8.466,1.125    s-3.658,4.873-3.252,7.897c0.406,3.024,2.395,5.602,5.218,6.761c89.261,36.751,144.772,117.776,161.392,144.874    C150.795,260.908,115.29,257.451,87.519,238.092z M279.969,114.046c37.6-53.788,109.708-86.113,214.408-96.138    c-2.65,35.375-17.158,159.05-91.892,211.175c-37.438,26.116-85.311,30.57-142.305,13.433    c19.284-32.09,92.484-142.574,212.405-191.954c2.819-1.161,4.805-3.738,5.209-6.76c0.404-3.022-0.835-6.031-3.25-7.892    c-2.415-1.861-5.64-2.292-8.459-1.131C351.388,82.01,279.465,179.805,252.231,222.711    C248.573,184.367,258.381,145.945,279.969,114.046L279.969,114.046z M262.694,368.017c15.097-26.883,43.468-43.587,74.3-43.746    c47.906,0.521,86.353,39.717,85.95,87.625c-0.001,7.188-0.857,14.351-2.55,21.337c-0.67,2.763,0.08,5.677,1.999,7.774    c1.919,2.097,4.757,3.1,7.568,2.676c1.994-0.272,4.005-0.393,6.017-0.362c29.59,0.283,54.467,22.284,58.367,51.617H17.661    c3.899-29.333,28.777-51.334,58.367-51.617c4-0.004,7.989,0.416,11.9,1.254c4.622,0.985,9.447,0.098,13.417-2.467    c3.858-2.519,6.531-6.493,7.408-11.017c7.793-40.473,43.043-69.838,84.258-70.192c16.045-0.002,31.757,4.582,45.283,13.212    c4.01,2.561,8.897,3.358,13.512,2.205C256.422,375.165,260.36,372.163,262.694,368.017L262.694,368.017z\"/>	</g></g>"
      },
    })
  }

  addNode() {
    this.diagram.addNode({
      id: faker.random.uuid().toString(),
      height: 45,
      offsetX: _.floor(Math.random() * this.diagram.element.clientWidth),
      offsetY: _.floor(Math.random() * this.diagram.element.clientHeight),
      // shape: {type: "Flow", shape: "Data"},
      shape: {type: "Text"},
      // constraints: NodeConstraints.Default | NodeConstraints.Shadow,
      // style: { borderWidth:5,fill: "#76e019", strokeColor: "#345678"},
      borderWidth: 5,
      annotations: [
        {
          content: faker.name.findName(),
          margin: {left: 25, right: 25}
        }
      ]
    })
  }

  addHtml() {
    this.diagram.addNode(
        {
          offsetX: _.floor(Math.random() * this.diagram.element.clientWidth),
          offsetY: _.floor(Math.random() * this.diagram.element.clientHeight),
          // Size of the node
          width: 200,
          height: 100,
          style: {
            fill: "#6BA5D7",
            strokeColor: "white"
          },
          //sets the type of the shape as HTML
          shape: {
            type: "HTML",
            content: `<div class="chart-shape"><div class="chart-content">${faker.name.findName()}</div></div>`
          }

        }
    )
  }

  addText() {

    this.diagram.addNode({
      // Position of the node
      offsetX: 250,
      offsetY: 250,
      // Size of the node
      width: 100,
      height: 100,
      //Sets type of the shape as text
      shape: {
        type: "Text",
        content: "Text Element"
      },
      //Customizes the appearances such as text, font, fill, and stroke.
      style: {
        strokeColor: "none",
        fill: "none",
        color: "black",
        textAlign: "Center"
      }
    })
  }

  connect() {
    this.diagram.addConnector({
      id: "connector1",
      sourceID: "node1",
      targetID: "node2"
    })
  }

  getNodeDefaults(node) {
    let obj: any = {};
    if (obj.width === undefined) {
      obj.width = 145;
    } else {
      let ratio = 100 / obj.width;
      obj.width = 100;
      if (obj.height) {
        obj.height *= ratio;
      }
    }
    obj.style = {fill: "#ffffff", strokeColor: blue};
    obj.annotations = [{
      style: {color: blue, fill: "transparent"}
    }];

    //Set ports
    obj.ports = this.getPortDefault();
    return obj;
  }

  getConnectorDefaults(obj) {
    if (obj.id.indexOf("connector") !== -1) {
      obj.type = "Straight";
      obj.style = {strokeColor: blue, strokeWidth: 2}
      obj.targetDecorator = {shape: "None", width: 10, height: 10};
    }
  }

  getPortDefault() {
    return [{
      id: "CentralPort",
      shape: "Circle",
      offset: {x: 0.5, y: 0.0},
      height: 8,
      width: 8,
      visibility: PortVisibility.Hover,
      text: "In - 1",
      constraints: PortConstraints.Draw,
    }]
    // return [
    //   {id: "port1", shape: "Circle", offset: {x: 0, y: 0.5}},
    //   {id: "port2", shape: "Circle", offset: {x: 0.5, y: 1}},
    //   {id: "port3", shape: "Circle", offset: {x: 1, y: 0.5}},
    //   {id: "port4", shape: "Circle", offset: {x: 0.5, y: 0}}
    // ];
  }

  //Sets the Node style for DragEnter element.
  dragEnter(e) {
    // let obj = args.element;
    // if (obj && obj.width && obj.height) {
    //   let oWidth = obj.width;
    //   let oHeight = obj.height;
    //   let ratio = 100 / obj.width;
    //   obj.width = 100;
    //   obj.height *= ratio;
    //   if (obj.offsetX) obj.offsetX += (obj.width - oWidth) / 2;
    //   if (obj.offsetY) obj.offsetY += (obj.height - oHeight) / 2;
    //   obj.style = {fill: "#357BD2", strokeColor: "white"};
    // }

    const el = e.element;
    const id = e.source.selectedSymbol.id;
    _.assign(el, this.getShape())
    let svg = null;
    switch (id) {
      case "Company":
        svg = CompanySvg
        break;
      case "Individual":
        svg = IndividualSvg
        break;
      case "Trust":
        svg = TrustSvg
        break;
      case "Asset":
        svg = AssetSvg
        break;
      case "Project":
        svg = ProjectSvg
        break;
      case "Custom":
        svg = CustomSvg
        break;
      default:
        throw new Error(`Type ${id} has no icon yet.`)
    }
    el.annotations[0].template = `<div class='node-icon'>${svg}</div>`


  }

  dragOver(e) {
    debugger
  }

  onDrop(e) {
    // take a moment to update the DOM
    setTimeout(() => {
      this.listenToDots()
    }, 700)

  }

  palettegetNodeDefaults(symbol: any) {
    symbol.style = {strokeColor: "#757575"}
    if (symbol.id === "Terminator" || symbol.id === "Process") {
      symbol.width = 80;
      symbol.height = 40;
    } else if (
        symbol.id === "Decision" ||
        symbol.id === "Document" ||
        symbol.id === "PreDefinedProcess" ||
        symbol.id === "PaperTap" ||
        symbol.id === "DirectData" ||
        symbol.id === "MultiDocument" ||
        symbol.id === "Data"
    ) {
      symbol.width = 50;
      symbol.height = 40;
    } else {
      symbol.width = 50;
      symbol.height = 50;
    }
  }


  diagramClick(e) {
    // const from = e.actualObject;
    // if (_.isNil(from)) {
    //   return;
    // }
    // this.isDrawing = true;
    // this.draw();
  }

  getSymbolInfo(symbol: any) {
    return {fit: true};
  }

  mounted() {
    // this.diagram.contextMenuModule.contextMenu.addEventListener("beforeOpen", (args) => {
    //   if (args.event && (args.event.which === 3))
    //     args.cancel = true;
    // });
    // this.diagram.contextMenuModule.contextMenu.beforeOpen = (args) => {
    //   args.event = this.globevent;
    //   this.diagram.contextMenuModule.contextMenuBeforeOpen(args);
    // }

    // todo: should be able to do with keydown
    // (window["Mousetrap"] as any).bind(["space"], (e) => {
    //   this.tool = DiagramTools.ZoomPan;
    //   return false;
    // });

  }

  scrollChange(e) {
    if (e.panState === "Completed") {
      this.tool = DiagramTools.MultipleSelect | DiagramTools.DrawOnce | DiagramTools.SingleSelect;
      // todo: need to click a second time to enable the tools it seems
      return false;
    }
  }

  created() {

  }


}


</script>
<style>
.context-menu {
  display: none;
  position: absolute;
  background-color: white;
}

.toolbar {
  background-color: white;
  margin: 5px;
  position: absolute;
  top: 0;
  padding: 12px;
  height: 50px;
  width: 300px;
  left: 410px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.05);

}

.pencil {
  margin: 12px 10px 0 14px;
  float: right;
}

.title {
  margin: 11px 0 0 14px;
  float: left;
  font-size: 22px;
  color: #696969;
}

.title-wrapper {
  background-color: white;
  margin: 5px;
  position: absolute;

  top: 0;
  height: 50px;
  width: 300px;
  left: 100px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.05);

}

.logo {
  width: 90px;
  height: 50px;
  background-color: white;
  margin: 5px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.05);
}

.header {
  background-color: transparent;
  position: absolute;
  top: 10px;
  left: 50px;
  z-index: 1200;

}

.diagram-wrapper {
  width: 100%;
  height: 100%;
}

.left-panel {
  position: absolute;
  top: 20%;
  left: 50px;
  z-index: 1200;

}

.palette {

  background-color: white;
  width: 100px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.search-button {
  background-color: transparent;
  border: none;
  margin: 15px 0 0 30px;
  cursor: pointer;
}

.search {

  background-color: white;
  width: 100px;
  height: 50px;

  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

}

.overview-panel {
  width: 255px;
  height: 255px;
  position: absolute;
  right: 0px;
  bottom: 0px;
  margin: 5px;
  background: #ffffff;
  border: 1px solid #696969;
  border-radius: 2px;
}

.footer {
  background-color: #292929 !important;
  color: white !important;
  font-size: 12px;
  padding: 10px;
}

.footer a {
  color: white !important;
  text-decoration: none;
  font-size: 12px;
  box-shadow: 0px -4px 8px 4px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12);
}

.e-symbol-draggable {
  margin: 0px 0 0 5px;
  cursor: pointer;
}

.e-symbolpalette {
  height: 100% !important;
}

.e-diagram-resize-handle {
  fill: white;
  opacity: 1;
  stroke: orangered;
}

.e-diagram-border {
  stroke: #42b983;
  stroke-width: 2px;
  stroke-dasharray: 0;
  padding: 5px;
  margin: 5px;
  opacity: 1.0;
  fill: transparent;
}

.chart-shape {
  background-color: #42b983;
  border: 2px solid red;
  border-radius: 6px;
  width: 100%;
  height: 100%;
}

.chart-content {
  margin: 10px auto;
  max-width: 180px;
}

.dots {
  width: 12px;
  height: 4px;
  font-weight: bold;
  color: #696969;
  cursor: pointer;
}
</style>
<style scoped>
@font-face {
  font-family: 'e-ddb-icons';
  src: url(data:application/x-font-ttf;charset=utf-8;base64,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) format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'e-ddb-icons1';
  src: url(data:application/x-font-ttf;charset=utf-8;base64,AAEAAAAKAIAAAwAgT1MvMj1tSfIAAAEoAAAAVmNtYXDnEOdVAAABiAAAADZnbHlmdC1P4gAAAcgAAAAwaGVhZBJhohMAAADQAAAANmhoZWEIVQQDAAAArAAAACRobXR4CAAAAAAAAYAAAAAIbG9jYQAYAAAAAAHAAAAABm1heHABDgAUAAABCAAAACBuYW1lm+wy9gAAAfgAAAK1cG9zdLnsYngAAASwAAAAMAABAAAEAAAAAFwEAAAAAAAD+AABAAAAAAAAAAAAAAAAAAAAAgABAAAAAQAAgNcenF8PPPUACwQAAAAAANelrs4AAAAA16WuzgAAAAAD+AN6AAAACAACAAAAAAAAAAEAAAACAAgAAgAAAAAAAgAAAAoACgAAAP8AAAAAAAAAAQQAAZAABQAAAokCzAAAAI8CiQLMAAAB6wAyAQgAAAIABQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUGZFZABA5wDnAAQAAAAAXAQAAAAAAAABAAAAAAAABAAAAAQAAAAAAAACAAAAAwAAABQAAwABAAAAFAAEACIAAAAEAAQAAQAA5wD//wAA5wD//wAAAAEABAAAAAEAAAAAAAAAGAAAAAIAAAAAA/gDegACAAcAACUhCQEhATUhAQQC9P6G/YoBMQFF/YqGAjf+hgH0QwAAAAAAEgDeAAEAAAAAAAAAAQAAAAEAAAAAAAEAEwABAAEAAAAAAAIABwAUAAEAAAAAAAMAEwAbAAEAAAAAAAQAEwAuAAEAAAAAAAUACwBBAAEAAAAAAAYAEwBMAAEAAAAAAAoALABfAAEAAAAAAAsAEgCLAAMAAQQJAAAAAgCdAAMAAQQJAAEAJgCfAAMAAQQJAAIADgDFAAMAAQQJAAMAJgDTAAMAAQQJAAQAJgD5AAMAAQQJAAUAFgEfAAMAAQQJAAYAJgE1AAMAAQQJAAoAWAFbAAMAAQQJAAsAJAGzIERpYWdyYW1fU2hhcGVzX0ZPTlRSZWd1bGFyRGlhZ3JhbV9TaGFwZXNfRk9OVERpYWdyYW1fU2hhcGVzX0ZPTlRWZXJzaW9uIDEuMERpYWdyYW1fU2hhcGVzX0ZPTlRGb250IGdlbmVyYXRlZCB1c2luZyBTeW5jZnVzaW9uIE1ldHJvIFN0dWRpb3d3dy5zeW5jZnVzaW9uLmNvbQAgAEQAaQBhAGcAcgBhAG0AXwBTAGgAYQBwAGUAcwBfAEYATwBOAFQAUgBlAGcAdQBsAGEAcgBEAGkAYQBnAHIAYQBtAF8AUwBoAGEAcABlAHMAXwBGAE8ATgBUAEQAaQBhAGcAcgBhAG0AXwBTAGgAYQBwAGUAcwBfAEYATwBOAFQAVgBlAHIAcwBpAG8AbgAgADEALgAwAEQAaQBhAGcAcgBhAG0AXwBTAGgAYQBwAGUAcwBfAEYATwBOAFQARgBvAG4AdAAgAGcAZQBuAGUAcgBhAHQAZQBkACAAdQBzAGkAbgBnACAAUwB5AG4AYwBmAHUAcwBpAG8AbgAgAE0AZQB0AHIAbwAgAFMAdAB1AGQAaQBvAHcAdwB3AC4AcwB5AG4AYwBmAHUAcwBpAG8AbgAuAGMAbwBtAAAAAAIAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgECAQMABlNoYXBlcwAA) format('truetype');
  font-weight: normal;
  font-style: normal;
}

.e-ddb-icons {
  font-family: 'e-ddb-icons';
  speak: none;
  font-size: 16px;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.e-ddb-icons1 {
  font-family: 'e-ddb-icons1';
  speak: none;
  font-size: 16px;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.e-toggle-palette::before {
  content: "\e700"
}

.e-basic::before {
  content: "\e726";
}

.e-flow::before {
  content: "\e724";
}

.e-connector::before {
  content: "\e725";
}

.sb-mobile-palette {
  width: 240px;
  height: 100%;
  float: left;
}

.sb-mobile-palette-bar {
  display: none;
}

.e-diagram {

  height: 100% !important;
  min-height: 90vh;

}


</style>
