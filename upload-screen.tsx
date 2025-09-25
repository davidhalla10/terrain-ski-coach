//importing apis, libraries, etc.
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const UploadScreen: React.FC = () =>  {

    // Setting useState hooks
    const navigation = useNavigation<NavigationProp<any>>();
    const [showUpload, setShowUpload] = useState(true);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [permission, requestPermission] = useCameraPermissions();

    const cameraRef = useRef<CameraView | null>(null);
    const recordingTimerRef = useRef<number | null>(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, []);

    useEffect(() => {
        return () => {
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
            }
        }
    }, []);

    useEffect(() => {
        if (isRecording) {
            const pulse = () => {
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 0.5,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    if (isRecording) pulse();
                });
            };
            pulse();
        } else {
            pulseAnim.setValue(0);
        }
    }, [isRecording, pulseAnim]);

    //creating video player
    const player = useVideoPlayer(
        videoUri ? { uri: videoUri } : null,
        (player) => {
            if (player) {
                player.loop = false,
                player.play();
            }
        }
    )

    //video selection from library
    const pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'videos',
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        }) 
        if (!result.canceled){   
            setVideoUri(result.assets[0].uri)
        } else {
            setShowUpload(true);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
    };

    const startRecordingTimer = () => {
        setRecordingTime(0);
        recordingTimerRef.current = setInterval(() => {
            setRecordingTime(prev => prev +1 );
        }, 1000)
    };

    const stopRecordingTimer = () => {
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }
        setRecordingTime(0); 
    };

        //start recording feature
        const startRecording = async () => {
            if (cameraRef.current && isCameraReady && !isRecording) {
                try {
                    console.log("Starting recording...");
                    setIsRecording(true);
                    startRecordingTimer();

                    const video = await cameraRef.current.recordAsync({
                        maxDuration: 60 
                    });

                    if (video) {
                        setVideoUri(video.uri);
                        setShowCamera(false);
                    }
                } catch (error) {
                    console.error("Recording Failed", error);
                } finally {
                    setIsRecording(false);
                    stopRecordingTimer();
                }
            } else {
                console.log("Camera not ready yet.");
            }
        };

        //stop recording feature
        const stopRecording = () => {
            console.log("Stop Recording Pressed")
            if (isRecording) {
                cameraRef.current?.stopRecording();
                setIsRecording(false);
                stopRecordingTimer();
            }
        };

        //upload image feature
        const upload = () => {
            setShowUpload(false);
            pickVideo();
        };


        //opens camera
        const openCamera = () => {
            console.log("Opening Camera...");
            setIsCameraReady(false);
            setShowCamera(true);
            setRecordingTime(0);
        };

        // logs to the console 'cameras ready'
        const onCameraReady = () => {
            console.log("Camera is now ready");
            setIsCameraReady(true);
        };

        //permissions
        if (!permission) {
            return(
                <ImageBackground
                source={require("./background.png")}
                style={styles.background}>
                    <View style={styles.permission}>
                        <Text style={styles.Text}>Loading Camera...</Text>
                    </View>
                </ImageBackground>
            );
        }

        if (!permission.granted) {
            <ImageBackground
                source={require("./background.png")}
                style={styles.background}>
                    <View style={styles.permission}>
                        <Text style={styles.Text}>Camera permission is needed to use Freestyle AI</Text>
                        <TouchableOpacity style={styles.record} onPress={requestPermission}>
                            <Text style={styles.Text}>Click to grant permission</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
        };

        //styling
        return(
            <ImageBackground 
            source={require('./blue-background.png')}
            style={styles.background}>
                
                   {showCamera ? (
                    <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    mode='video'
                    onCameraReady={onCameraReady}>
                        
                    {isRecording && (
                        <View style={styles.recordingOverlay}>
                            <View style={styles.recordingIndicator}>
                                <Animated.View
                                style={[
                                    styles.recordingDot,
                                    { opacity: pulseAnim }
                                ]}
                                />
                                <Text style={styles.recordingText}>REC</Text>
                                <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
                            </View>
                        </View>
                    )}

                    {!isCameraReady && (
                        <View style={styles.loadingOverlay}>
                            <Text style={styles.loadingText}>Camera loading...</Text>
                        </View>
                    )}

                    <View style={styles.controlsContainer}>
                        {!isRecording ? (
                            <TouchableOpacity
                            style={[styles.recordButton, !isCameraReady && styles.disabled]}
                            onPress={startRecording}
                            disabled={!isCameraReady}>
                            <View style={styles.recordButtonInner}>
                                <Text style={styles.recordButtonText}>●</Text>
                            </View>
                            </TouchableOpacity>

                        ) : (
                            <TouchableOpacity
                            style={styles.stopButton}
                            onPress={stopRecording}>
                                <View style={styles.stopButton}>
                                    <Text style={styles.stopButtonText}>■</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowCamera(false)}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    </CameraView>
                   ) : (
                    <>
                    
                     {videoUri && (
                            <VideoView
                                style={styles.videoPlayer}
                                player={player}
                                allowsFullscreen
                                allowsPictureInPicture
                                nativeControls>
                                </VideoView>
                        )}
                        
                    {showUpload && (
                        <TouchableOpacity style={styles.upload} onPress={upload}>
                            <Text style={styles.Text}>Upload a Video</Text>
                        </TouchableOpacity>
                    )}
                    {!showUpload &&(
                        <TouchableOpacity style={[styles.analysis, (!setShowUpload)]} onPress={() => navigation.navigate ("Analysis")}>
                            <Text style={styles.Text}>Send video for analysis</Text>
                        </TouchableOpacity>
                    )}
                    {showUpload &&(
                        <TouchableOpacity style={styles.record} onPress={openCamera}>
                        <Text style={styles.Text}>Record a Video</Text>
                    </TouchableOpacity>
                    )}
                    
                   </>
                   )}
            </ImageBackground>
        )
    }

export default UploadScreen;


const styles = StyleSheet.create({
    background: {
        width: "100%",
        height: "100%"
    },
    message: {
        textAlign: 'center',
        padding: 20
    },
    permission: {
        backgroundColor: '#ffffffff',
        alignSelf: 'center',
        padding: 20,
        marginTop: 280,
        borderRadius: 30,
    },
    upload: {
        backgroundColor: '#ffffffff',
        alignSelf: 'center',
        padding: 20,
        marginTop: 280,
        borderRadius: 30,
    },
    Text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 27,
        color: '#0A304C'
    },
    videoPlayer: {
        width: "100%",
        height: 400,
        marginTop: 100,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center'
    },
    record:{
        backgroundColor: '#ffffffff',
        alignSelf: 'center',
        padding: 20,
        marginTop: 30,
        borderRadius: 30,
    },
    analysis: {
        backgroundColor: '#ffffffff',
        alignSelf: 'center',
        padding: 20,
        marginTop: 120,
        borderRadius: 30,
    },
    disabled: {
        backgroundColor: '#cccccc',
        opacity: 0.6,
    },
    camera: {
        flex:1,
    },
    recordingOverlay: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        zIndex: 1,
    },
    recordingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba (0,0,0,0.7)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    recordingDot: {
        width: 12,
        height: 12,
        backgroundColor: '#ff0000',
        borderRadius: 6,
        marginRight: 8,
    },
    recordingText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    recordingTime: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    loadingText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1,
    },
    recordButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    recordButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ff0000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordButtonText: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    stopButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    stopButtonInner: {
        width: 40,
        height: 40,
        backgroundColor: '#ff0000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stopButtonText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    }
})    