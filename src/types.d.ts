import { YAMLScalar, YAMLSequence, YAMLNode } from 'yaml-ast-parser';
import * as THREE from 'three';
import { geometryArguments } from './geometryArguments';
import { materialArguments } from './materialArguments';


export interface YAMLMapping extends YAMLNode {
  key: YAMLScalar;
  value: YAMLNode & Partial<YAMLSequence>;
}
export type MeshesObject = {
  [key: string]: {
    type?: keyof typeof geometryArguments;
    material?: string | {
      type?: keyof typeof materialArguments;
      color?: string | number;
    };
    [key: string]: any;
  };
};
export type Camera = THREE.PerspectiveCamera | THREE.OrthographicCamera;
export type Light = THREE.AmbientLight | THREE.SpotLight | THREE.DirectionalLight | THREE.HemisphereLight;
export type Material = THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial | THREE.MeshToonMaterial | THREE.MeshNormalMaterial | THREE.MeshDepthMaterial | THREE.MeshDistanceMaterial | THREE.MeshBasicMaterial | THREE.LineBasicMaterial | THREE.LineDashedMaterial | THREE.PointsMaterial | THREE.SpriteMaterial | THREE.ShaderMaterial;
