import React, { useEffect } from 'react';
import { createAnimation } from '@ionic/react';
import './AnimationDemo.css';

const AnimationDemo: React.FC = () => {
    useEffect(simpleAnimation, []);

    return (
        <div className="container">
            <div className="square-a">
                <p>Test 1</p>
            </div>
        </div>
    );

    function simpleAnimation() {
        const el = document.querySelector('.square-a');
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(1000)
                .direction('alternate')
                .iterations(Infinity)
                .keyframes([
                    { offset: 0, transform: 'scale(3)', opacity: '1' },
                    {
                        offset: 1, transform: 'scale(1.5)', opacity: '0.5'
                    }
                ]);
            animation.play();
        }
    }
};

export default AnimationDemo;