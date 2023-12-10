import React from 'react';
import classNames from 'classnames';
import './Avatar.scss';

const BAD_CHARACTERS = /[^A-Za-z\s]+/g;
const WHITESPACE = /\s+/g;

const getInitials = (name?: string): string | undefined => {
  if (!name) {
    return;
  }

  const cleaned = name.replace(BAD_CHARACTERS, '').replace(WHITESPACE, ' ');
  const parts = cleaned.split(' ');
  const initials = parts.map(part => part.trim()[0]);
  if (!initials.length) {
    return;
  }

  return initials.slice(0, 1).join('');
};

interface Props {
  avatarPath?: string;
  color?: string;
  conversationType: 'group' | 'direct';
  noteToSelf?: boolean;
  name?: string;
  profileName?: string;
  size: number;
  id?: string;
  groupChats?: boolean;
  allBots?: boolean;
  coworker?: boolean;
  noClickEvent?: boolean; // 不注册单击双击事件，比如会话列表，搜索结果列表
  archiveButton?: boolean;
  nonImageType?: 'search' | 'instant-meeting';
  authorPhoneNumber?: any;
  conversationId?: any;
  fromMainTab?: boolean;
  leftGroup?: any;
  autoAdaptMode?: boolean; // 头像根据自适应外面的布局宽度，仅在宫格布局的头像下生效,
  onClickAvatar: (e: any) => void;
}

interface State {
  imageBroken: boolean;
  styleTop: number;
  styleLeft: number;
  forceNotCloseProfile: boolean;
}

export class Avatar extends React.Component<Props, State> {
  public handleImageErrorBound: () => void;
  public lastAddListenId: string;
  public avatarClickTimer: NodeJS.Timeout | undefined;
  public avatarUpdateTimer: NodeJS.Timeout | undefined;

  public constructor(props: Props) {
    super(props);
    this.handleImageErrorBound = this.handleImageError.bind(this);

    this.lastAddListenId = '';
    this.state = {
      imageBroken: false,
      styleTop: 100,
      styleLeft: 0,
      forceNotCloseProfile: false,
    };
  }

  // 计算是否超出屏幕;超出后停止移动监听
  inWindow = (
    left: number,
    top: number,
    startPosX: number,
    startPosY: number
  ) => {
    const H = document.body.clientHeight;
    const W = document.body.clientWidth;
    if (
      (left < 20 && startPosX > left) ||
      (left > W - 20 && startPosX < left) ||
      (top < 20 && startPosY > top) ||
      (top > H - 20 && startPosY < top)
    ) {
      document.body.onmousemove = null;
      document.body.onmouseup = null;
      return false;
    }
    return true;
  };

  onMouseDown = (e: {
    preventDefault: () => void;
    clientX: any;
    clientY: any;
  }) => {
    e.preventDefault(); // 记录初始移动的鼠标位置
    const startPosX = e.clientX;
    const startPosY = e.clientY;
    const { styleLeft, styleTop } = this.state; // 添加鼠标移动事件
    document.body.onmousemove = e => {
      const left = e.clientX - startPosX + styleLeft;
      const top = e.clientY - startPosY + styleTop;
      if (this.inWindow(e.clientX, e.clientY, startPosX, startPosY)) {
        this.setState({
          styleLeft: left,
          styleTop: top,
        });
      }
    }; // 鼠标放开时去掉移动事件
    document.body.onmouseup = function () {
      document.body.onmousemove = null;
    };
  };

  public getPrivateUserId = () => {
    const {
      id,
      groupChats,
      allBots,
      conversationType,
      archiveButton,
      nonImageType,
      coworker,
    } = this.props;
    if (
      !nonImageType &&
      !groupChats &&
      !allBots &&
      !coworker &&
      conversationType === 'direct' &&
      !archiveButton &&
      id !== 'MENTIONS_ALL'
    ) {
      if (!id) {
        console.log('Avatar Bad Props, No ID!!!!');
      }
      return id;
    }
    return undefined;
  };

  public isBot = () => {
    const userId = this.getPrivateUserId();
    return userId && userId.length <= 6;
  };

  public handleImageError() {
    // tslint:disable-next-line no-console
    console.log('Avatar: Image failed to load; failing over to placeholder');
    this.setState({
      imageBroken: true,
    });
  }

  public renderImage() {
    const { avatarPath, size, autoAdaptMode } = this.props;
    const { imageBroken } = this.state;

    if (!avatarPath || imageBroken) {
      return null;
    }

    // 重新设置头像大小，有圈和没圈一样大
    let resetSize = autoAdaptMode ? '100%' : `${size}px`;

    return (
      <img
        onError={this.handleImageErrorBound}
        src={avatarPath}
        style={{ width: resetSize, height: resetSize }}
      />
    );
  }
  public renderNoImage() {
    const { conversationType, name, size, archiveButton, autoAdaptMode } =
      this.props;

    const initials = getInitials(name);

    // 重新设置头像大小，有圈和没圈一样大
    const resetSize = autoAdaptMode ? '100%' : `${size}px`;
    const alignCenterSx = autoAdaptMode
      ? {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }
      : { lineHeight: resetSize };

    if (archiveButton) {
      return (
        <div
          className={classNames(
            'module-avatar__icon',
            'module-avatar__icon--archive-button',
            `module-avatar__icon--${size}`
          )}
        />
      );
    }

    if (initials) {
      return (
        <div
          style={{
            width: resetSize,
            height: resetSize,
            ...alignCenterSx,
          }}
          className={classNames(
            'module-avatar__label',
            `module-avatar__label--${size}`
          )}
        >
          {initials}
        </div>
      );
    }

    return (
      <div
        className={classNames(
          'module-avatar__icon',
          `module-avatar__icon--${conversationType}`,
          `module-avatar__icon--${size}`
        )}
      />
    );
  }

  public getPrivateUserBackgroundColor = (): string | undefined => {
    const { imageBroken } = this.state;
    const { avatarPath, noteToSelf, groupChats, nonImageType } = this.props;
    const hasImage = !noteToSelf && avatarPath && !imageBroken;
    if (hasImage || noteToSelf || groupChats || nonImageType) {
      return undefined;
    }

    const backgroundColors = [
      'rgb(255,69,58)',
      'rgb(255,159,11)',
      'rgb(254,215,9)',
      'rgb(49,209,91)',
      'rgb(120,195,255)',
      'rgb(11,132,255)',
      'rgb(94,92,230)',
      'rgb(213,127,245)',
      'rgb(114,126,135)',
      'rgb(255,79,121)',
    ];
    const userId = this.getPrivateUserId();
    if (userId) {
      const startPos = userId.includes('@') ? 0 : userId.length - 1;
      const sub = userId.substr(startPos, 1);
      const index = parseInt(sub, 10) % 10;
      if (index || index === 0) {
        return backgroundColors[index];
      } else {
        return backgroundColors[sub.charCodeAt(0) % 10];
      }
    }
    return undefined;
  };

  public renderMainAvatar() {
    const {
      avatarPath,
      color,
      size,
      noteToSelf,
      autoAdaptMode = false,
      onClickAvatar,
    } = this.props;
    const { imageBroken } = this.state;
    const hasImage = !noteToSelf && avatarPath && !imageBroken;

    if (
      !autoAdaptMode &&
      ![20, 24, 28, 36, 40, 48, 56, 80, 88, 112].includes(size)
    ) {
      throw new Error(`Size ${size} is not supported!`);
    }

    // 重新设置头像大小，有圈和没圈一样大
    let resetSize = autoAdaptMode ? '100%' : `${size}px`;
    const backgroundColor = this.getPrivateUserBackgroundColor();

    return (
      <div
        role="button"
        style={{
          width: resetSize,
          height: resetSize,
          backgroundColor,
          cursor: 'pointer',
        }}
        className={classNames(
          'module-avatar',
          autoAdaptMode ? null : `module-avatar--${size}`,
          hasImage ? 'module-avatar--with-image' : 'module-avatar--no-image',
          !hasImage ? `module-avatar--${color}` : null
        )}
        onClick={onClickAvatar}
      >
        {hasImage ? this.renderImage() : this.renderNoImage()}
      </div>
    );
  }

  public render() {
    const { autoAdaptMode } = this.props;

    const extraStyle = autoAdaptMode
      ? {
          position: 'absolute' as const,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }
      : {};

    return (
      <div
        className={'only-for-before-join-meeting'}
        style={{
          borderRadius: '50%',
          position: 'relative',
          pointerEvents: 'none',
          ...extraStyle,
        }}
      >
        {this.renderMainAvatar()}
      </div>
    );
  }
}
