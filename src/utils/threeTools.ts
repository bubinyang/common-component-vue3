import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
interface IObject<T = any> {
  [key: string]: T;
}

interface IDomTagParams {
  dom: HTMLDivElement;
  position: IObject;
  id: any;
}

/**
 * @param id 需要3D展示的dom标签ID
 * @param position tootip在3D空间显示的位置
 * @id 该弹出框的标识
 */
export const domTag = function ({ dom, position, id }: IDomTagParams): CSS2DObject {
  // const dom=document.querySelector(id)
  const moonLabel = new CSS3DObject(dom);
  const { x, y, z } = position;
  moonLabel.position.set(x, y, z);
  moonLabel.name = id;
  return moonLabel;
};
