import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Group, Text, Avatar, Stack, ActionIcon } from '@mantine/core';
import { IconPhone, IconPhoneOff, IconMicrophone, IconMicrophoneOff } from '@tabler/icons';
import { socket } from '../../App';

const VoiceCallModal = ({ 
  isOpen, 
  onClose, 
  callData, 
  currentUserId, 
  isIncoming = false 
}) => {
  const [callState, setCallState] = useState('connecting'); // connecting, ringing, connected, ended
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const callTimerRef = useRef(null);

  const rtcConfig = React.useMemo(() => ({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  }), []);

  const handleCallAnswer = React.useCallback(async ({ answer }) => {
    try {
      await peerConnectionRef.current.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error handling call answer:', error);
    }
  }, []);

  const handleIceCandidate = React.useCallback(async ({ candidate }) => {
    try {
      await peerConnectionRef.current.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }, []);

  const cleanupCall = React.useCallback(() => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  }, []);

  const handleCallEnd = React.useCallback(() => {
    setCallState('ended');
    cleanupCall();
    setTimeout(() => onClose(), 1000);
  }, [onClose, cleanupCall]);

  const handleCallReject = React.useCallback(() => {
    setCallState('ended');
    cleanupCall();
    setTimeout(() => onClose(), 1000);
  }, [onClose, cleanupCall]);

  const startCallTimer = React.useCallback(() => {
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isOpen && callData) {
      if (isIncoming) {
        setCallState('ringing');
      } else {
        initializeCall();
      }
    }

    return () => {
      cleanupCall();
    };
  }, [isOpen, callData, isIncoming, initializeCall, cleanupCall]);

  useEffect(() => {
    // Socket event listeners for WebRTC signaling
    socket.on('call-answer', handleCallAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('call-end', handleCallEnd);
    socket.on('call-reject', handleCallReject);

    return () => {
      socket.off('call-answer', handleCallAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('call-end', handleCallEnd);
      socket.off('call-reject', handleCallReject);
    };
  }, [handleCallEnd, handleCallReject]);

  const initializeCall = React.useCallback(async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }

      // Create peer connection
      peerConnectionRef.current = new RTCPeerConnection(rtcConfig);
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
          setCallState('connected');
          startCallTimer();
        }
      };

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate && callData) {
          socket.emit('ice-candidate', {
            to: callData.otherUserId,
            candidate: event.candidate
          });
        }
      };

      if (!isIncoming) {
        // Create and send offer
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        
        socket.emit('call-offer', {
          to: callData.otherUserId,
          from: currentUserId,
          offer: offer,
          conversationId: callData.conversationId
        });
        
        setCallState('ringing');
      }
      
    } catch (error) {
      console.error('Error initializing call:', error);
      setCallState('ended');
    }
  }, [callData, currentUserId, isIncoming, rtcConfig, startCallTimer]);

  const acceptCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }

      // Create peer connection
      peerConnectionRef.current = new RTCPeerConnection(rtcConfig);
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
          setCallState('connected');
          startCallTimer();
        }
      };

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate && callData) {
          socket.emit('ice-candidate', {
            to: callData.otherUserId,
            candidate: event.candidate
          });
        }
      };

      // Set remote description and create answer
      await peerConnectionRef.current.setRemoteDescription(callData.offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      
      socket.emit('call-answer', {
        to: callData.otherUserId,
        from: currentUserId,
        answer: answer
      });
      
      setCallState('connecting');
      
    } catch (error) {
      console.error('Error accepting call:', error);
      rejectCall();
    }
  };

  const rejectCall = () => {
    socket.emit('call-reject', {
      to: callData?.otherUserId,
      from: currentUserId
    });
    setCallState('ended');
    setTimeout(() => onClose(), 1000);
  };

  const endCall = () => {
    socket.emit('call-end', {
      to: callData?.otherUserId,
      from: currentUserId
    });
    setCallState('ended');
    cleanupCall();
    setTimeout(() => onClose(), 1000);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallStateText = () => {
    switch (callState) {
      case 'connecting':
        return 'Connecting...';
      case 'ringing':
        return isIncoming ? 'Incoming call' : 'Calling...';
      case 'connected':
        return formatDuration(callDuration);
      case 'ended':
        return 'Call ended';
      default:
        return '';
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={() => {}}
      centered
      withCloseButton={false}
      size="sm"
      radius="lg"
    >
      <Stack align="center" spacing="xl" p="xl">
        <Avatar
          src={callData?.otherUser?.avatar ? 
            process.env.REACT_APP_UPLOADS_PATH + callData.otherUser.avatar : null}
          size={100}
          radius="50%"
        />
        
        <div style={{ textAlign: 'center' }}>
          <Text size="xl" weight={600}>
            {callData?.otherUser?.name || callData?.otherUser?.username}
          </Text>
          <Text color="dimmed" size="sm">
            {getCallStateText()}
          </Text>
        </div>

        {callState === 'ringing' && isIncoming && (
          <Group spacing="xl">
            <ActionIcon 
              size={60} 
              radius="50%" 
              color="red" 
              variant="filled"
              onClick={rejectCall}
            >
              <IconPhoneOff size={30} />
            </ActionIcon>
            <ActionIcon 
              size={60} 
              radius="50%" 
              color="green" 
              variant="filled"
              onClick={acceptCall}
            >
              <IconPhone size={30} />
            </ActionIcon>
          </Group>
        )}

        {(callState === 'connecting' || callState === 'connected') && (
          <Group spacing="md">
            <ActionIcon
              size={50}
              radius="50%"
              color={isMuted ? "red" : "blue"}
              variant="filled"
              onClick={toggleMute}
            >
              {isMuted ? <IconMicrophoneOff size={24} /> : <IconMicrophone size={24} />}
            </ActionIcon>
            <ActionIcon
              size={50}
              radius="50%"
              color="red"
              variant="filled"
              onClick={endCall}
            >
              <IconPhoneOff size={24} />
            </ActionIcon>
          </Group>
        )}

        {(callState === 'ringing' && !isIncoming) && (
          <ActionIcon
            size={60}
            radius="50%"
            color="red"
            variant="filled"
            onClick={endCall}
          >
            <IconPhoneOff size={30} />
          </ActionIcon>
        )}

        {callState === 'ended' && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </Stack>

      {/* Hidden audio elements */}
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
    </Modal>
  );
};

export default VoiceCallModal;