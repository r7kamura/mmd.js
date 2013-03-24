# Model Data
A specific of model data structure which mmd.js accepts.


## Format
We use EBNF-like format.

* `<x>{3}` means `<x> <x> <x>`
* `<x>?` means `<x> | ε`
* `<x>*` means `{<x>}`
* `#...` means comment-line


## Data Type
```
<byte>    ::= unsigned char
<sbyte>   ::= char
<ushort>  ::= unsigned short
<short>   ::= short
<uint>    ::= unsigned int
<int>     ::= int
<float>   ::= float
<float2>  ::= [float]
<float3>  ::= [float, float, float]
<float4>  ::= [float, float, float, float]
<index>   ::= each index size is defined in modelHeader
```


## Data Structure
```
# Common symbols
<xyz>                            ::= <float3>
<xyzw>                           ::= <float4>
<rgba>                           ::= <float4>
<rgb>                            ::= <float3>
<uv>                             ::= <float2>
<boolean>                        ::= <byte>
<name>                           ::= <nameNormal> <nameEnglish>
<nameNormal>                     ::= <textBuffer>
<nameEnglish>                    ::= <textBuffer>
<textBuffer>                     ::= <textLength> <textBytes>
<textLength>                     ::= <int>
<textBytes>                      ::= <byte>*

# Root symbol
<model>                          ::= <modelHeader> <modelInformation> <vertexNumber> <vertexes> <faceNumber> <faces> <textureNumber> <textures> <materialNumber> <materials> <boneNumber> <bones> <morphNumber> <morphs> <frameNumber> <frames> <rigidNumber> <rigids> <jointNumber> <joints>

# Numbers
<vertexNumber>                   ::= <int>
<faceNumber>                     ::= <int>
<textureNumber>                  ::= <int>
<materialNumber>                 ::= <int>
<boneNumber>                     ::= <int>
<morphNumber>                    ::= <int>
<frameNumber>                    ::= <int>
<rigidNumber>                    ::= <int>
<jointNumber>                    ::= <int>

<modelHeader>                    ::= <modelName> <modelVersion> <modelInformation>
<modelName>                      ::= <byte>{4}
<modelVersion>                   ::= <float>
<modelInformation>               ::= <isUtf8> <extendedUvIndexSize> <vertexIndexSize> <textureIndexSize> <matrialIndexSize> <boneIndexSize> <morphIndexSize> <rigidIndexSize>
<isUtf8>                         ::= <boolean>
<extendedUvIndexSize>            ::= <byte>
<vertexIndexSize>                ::= <byte>
<textureIndexSize>               ::= <byte>
<matrialIndexSize>               ::= <byte>
<boneIndexSize>                  ::= <byte>
<morphIndexSize>                 ::= <byte>
<rigidIndexSize>                 ::= <byte>

<modelInformation>               ::= <name> <comment> <commentEnglish>
<comment>                        ::= <textBuffer>
<commentEnglish>                 ::= <textBuffer>

<vertexes>                       ::= <vertex>*
<vertex>                         ::= <vertexPosition> <vertexNormal> <vertexUv> <vertexAddedUvs> <vertexWeightType> <vertexWeight> <vertexEdgeRate>
<vertexPosition>                 ::= <xyz>
<vertexNormal>                   ::= <xyz>
<vertexUv>                       ::= <uv>
<vertexAddedUvs>                 ::= <vertexAddedUv>*
<vertexWeightType>               ::= <byte>
<vertexWeight>                   ::= <vertexWeightBdef1> | <vertexWeightBdef2> | <vertexWeightBdef4> | <vertexWeightSdef>
<vertexWeightBdef1>              ::= <index>
<vertexWeightBdef2>              ::= <index>{2} <vertexWeightRate>
<vertexWeightBdef4>              ::= <index>{4} <vertexWeightRate>{4}
<vertexWeightSdef>               ::= <index>{2} <vertexWeightRate> <vertexWeightSdefCVector> <vertexWeightSdefR0Vector>  <vertexWeightSdefR1Vector>
<vertexWeightSdefCVector>        ::= <xyz>
<vertexWeightSdefR0Vector>       ::= <xyz>
<vertexWeightSdefR1Vector>       ::= <xyz>
<vertexEdgeRate>                 ::= <float>

<faces>                          ::= <face>*
<face>                           ::= <vertexIndex>{3}
<vertexIndex>                    ::= <index>

<textures>                       ::= <texture>*
<texture>                        ::= <texturePath>
<texturePath>                    ::= <textBuffer>

<materials>                      ::= <material>*
<material>                       ::= <name> <materialDiffusion> <materialSpecular> <materialSpecularFactor> <materialAmbient> <materialAmbient> <materialDrawFlag> <materialEdgeColor> <materialEdgeSize> <materialNormalTextureIndexSize> <materialSphereTextureIndexSize> <materialSphereMode> <materialUseSharedToonFlag> <materialToonTexture> <materialMemo> <materialFaceSize>
<materialDiffusion>              ::= <rgba>
<materialSpecular>               ::= <rgb>
<materialSpecularFactor>         ::= <float>
<materialAmbient>                ::= <rgb>
<materialDrawFlag>               ::= <boolean>
<materialEdgeColor>              ::= <rgba>
<materialEdgeSize>               ::= <float>
<materialNormalTextureIndexSize> ::= <index>
<materialSphereTextureIndexSize> ::= <index>
<materialSphereMode>             ::= <byte>
<materialUseSharedToonFlag>      ::= <boolean>
<materialToonTexture>            ::= <index> | <materialSharedToonTexure>
<materialSharedToonTexure>       ::= <byte>
<materialMemo>                   ::= <textBuffer>
<materialFaceSize>               ::= <int>

<bones>                          ::= <bone>*
<bone>                           ::= <name> <bonePosition> <boneIndex> <boneTransitionState> <bone16BitFlag> <boneContent>
<bonePosition>                   ::= <xyz>
<boneIndex>                      ::= <index>
<boneTransitionState>            ::= <int>
<bone16BitFlag>                  ::= <byte>{2}
<boneContent>                    ::= <boneDestination> <boneAddedInformation>? <boneFixedAxisAngleVector>? <boneLocalAxisAngleVector>? <boneParentTransformationKey>? <boneIk>?
<boneDestination>                ::= <boneCoordinateOffset> | <boneDestinationIndexSize>
<boneCoordinateOffset>           ::= <xyz>
<boneDestinationIndexSize>       ::= <index>
<boneAddedInformation>           ::= <boneAddedParentIndexSize> <boneAddingRate>
<boneAddedParentIndexSize>       ::= <index>
<boneAddingRate>                 ::= <float>
<boneFixedAxisAngleVector>       ::= <xyz>
<boneLocalAxisAngleVector>       ::= <boneLocalXAxisAngleVector> <boneLocalYAxisAngleVector>
<boneLocalXAxisAngleVector>      ::= <xyz>
<boneLocalYAxisAngleVector>      ::= <xyz>
<boneParentTransformationKey>    ::= <int>
<boneIk>                         ::= <boneIkIndex> <boneIkLoopSize> <boneIkPerLoopLimitAngle> <boneIkLinkSize> <boneIkLinks>
<boneIkIndex>                    ::= <index>
<boneIkLoopSize>                 ::= <int>
<boneIkPerLoopLimitAngle>        ::= <float>
<boneIkLoopSize>                 ::= <int>
<boneIkLinks>                    ::= <boneIkLink>*
<boneIkLink>                     ::= <boneIkIndex> <boneIkLinkAngleLimited> <boneIkAngleLimit>?
<boneIkLinkAngleLimited>         ::= <boolean>
<boneIkAngleLimit>               ::= <boneIkAngleLowerLimitVector> <boneIkAngleUpperLimitVector>
<boneIkAngleLowerLimitVector>    ::= <xyz>
<boneIkAngleUpperLimitVector>    ::= <xyz>

<morphs>                         ::= <morph>*
<morph>                          ::= <name> <morphControlPanelType> <morphType> <morphOffsetSize> <morphOffsets>
<morphControlPanelType>          ::= <byte>
<morphType>                      ::= <byte>
<morphOffsetSize>                ::= <int>
<morphOffsets>                   ::= <morphOffset>*
<morphOffset>                    ::= <vertexMorph> | <uvMorph> | <boneMorph> | <materialMorph> | <groupMorph>
<vertexMorph>                    ::= <index> <vertexMorphCoordinateVector>
<uvMorph>                        ::= <index> <uvMorphOffsetVector>
<boneMorph>                      ::= <index> <boneMorphDistanceVector> <boneMorphRotationVector>
<materialMorph>                  ::= <index> <materialMorphUseMultipication> <materialDiffusion> <materialSpecular> <materialSpecularFactor> <materialAmbient> <materialEdgeColor> <materialEdgeSize> <materialTextureFactor> <materialSphereTextureFactor> <materialToonTextureFactor>
<groupMorph>                     ::= <index> <morphRate>
<vertexMorphCoordinateVector>    ::= <xyz>
<uvMorphOffsetVector>            ::= <xyzw>
<boneMorphDistanceVector>        ::= <xyz>
<boneMorphRotationVector>        ::= <xyzw>
<materialMorphUseMultipication>  ::= <boolean>
<materialTextureFactor>          ::= <rgba>
<materialSphereTextureFactor>    ::= <rgba>
<materialToonTextureFactor>      ::= <rgba>
<morphRate>                      ::= <float>

<frames>                         ::= <frame>*
<frame>                          ::= <name> <frameIsSpecial> <frameElementSize> <frameElements>
<frameIsSpecial>                 ::= <boolean>
<frameElementSize>               ::= <int>
<frameElements>                  ::= <frameElement>*
<frameElement>                   ::= <frameElementType> <index>
<frameElementType>               ::= <byte>

<rigids>                         ::= <rigid>*
<rigid>                          ::= <name> <boneIndex> <rigidGroup> <rigidCollisionFlag> <rigidShape> <rigidSize> <rigidPosition> <rigidRotation>
<rigidGroup>                     ::= <byte>
<rigidCollisionFlag>             ::= <ushort>
<rigidShape>                     ::= <byte>
<rigidSize>                      ::= <xyz>
<rigidPosition>                  ::= <xyz>
<rigidRotation>                  ::= <xyz>
<rigidMolarity>                  ::= <float>
<rigidTranslationDecay>          ::= <float>
<rigidRotationDecay>             ::= <float>
<rigidBounce>                    ::= <float>
<rigidFriction>                  ::= <float>
<rigidCalculationType>           ::= <byte>

<joints>                         ::= <joint>*
<joint>                          ::= <name> <jointType> <jointData>?
<jointType>                      ::= <byte>
<jointData>                      ::= <index> <index> <xyz> <xyz> <jointTranslationLowerLimit> <jointTranslationUpperLimit> <jointRotationLowerLimit> <jointRotationUpperLimit> <jointTranslationSpringFactor> <jointRotationSpringFactor>
<jointTranslationLowerLimit>     ::= <xyz>
<jointTranslationUpperLimit>     ::= <xyz>
<jointRotationLowerLimit>        ::= <xyz>
<jointRotationUpperLimit>        ::= <xyz>
<jointTranslationSpringFactor>   ::= <xyz>
<jointRotationSpringFactor>      ::= <xyz>
```
