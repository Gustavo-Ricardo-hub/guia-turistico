import React from 'react';
import { FlexWidget, ImageWidget, TextWidget } from 'react-native-android-widget';

export function MonumentoWidget({ nome, categoria, distancia, foto }) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        borderRadius: 20,
        padding: 12,
      }}
    >
      {foto ? (
        <ImageWidget image={foto} imageWidth={84} imageHeight={84} radius={12} />
      ) : null}
      <FlexWidget style={{ flex: 1, flexDirection: 'column', marginLeft: 12 }}>
        <TextWidget
          text="Monumento mais próximo"
          style={{ fontSize: 11, color: '#94A3B8' }}
        />
        <TextWidget
          text={nome || 'Abra o app para localizar'}
          maxLines={2}
          style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }}
        />
        {nome ? (
          <TextWidget
            text={`${categoria} • a ${distancia}`}
            style={{ fontSize: 12, color: '#CBD5E1' }}
          />
        ) : null}
      </FlexWidget>
    </FlexWidget>
  );
}
