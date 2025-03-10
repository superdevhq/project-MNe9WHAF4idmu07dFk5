
import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const P5Sketch: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only create the sketch once
    if (!sketchRef.current) return;
    
    // Store the created p5 instance so we can remove it later
    let p5Instance: p5;
    
    // The sketch function
    const sketch = (p: p5) => {
      // Array to store particles
      let particles: Particle[] = [];
      const numParticles = 100;
      
      // Particle class
      class Particle {
        pos: p5.Vector;
        vel: p5.Vector;
        acc: p5.Vector;
        color: p5.Color;
        size: number;
        
        constructor() {
          this.pos = p.createVector(p.random(p.width), p.random(p.height));
          this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1));
          this.acc = p.createVector(0, 0);
          this.color = p.color(p.random(100, 255), p.random(100, 255), p.random(100, 255), 150);
          this.size = p.random(5, 15);
        }
        
        update() {
          // Create attraction to mouse
          if (p.mouseX !== 0 && p.mouseY !== 0) {
            const mouse = p.createVector(p.mouseX, p.mouseY);
            const dir = p5.Vector.sub(mouse, this.pos);
            dir.normalize();
            dir.mult(0.5);
            this.acc = dir;
          }
          
          this.vel.add(this.acc);
          this.vel.limit(3);
          this.pos.add(this.vel);
          this.acc.mult(0);
          
          // Wrap around edges
          if (this.pos.x > p.width) this.pos.x = 0;
          if (this.pos.x < 0) this.pos.x = p.width;
          if (this.pos.y > p.height) this.pos.y = 0;
          if (this.pos.y < 0) this.pos.y = p.height;
        }
        
        display() {
          p.noStroke();
          p.fill(this.color);
          p.ellipse(this.pos.x, this.pos.y, this.size, this.size);
        }
      }
      
      // p5 setup function
      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        
        // Create particles
        for (let i = 0; i < numParticles; i++) {
          particles.push(new Particle());
        }
      };
      
      // p5 draw function - called in a loop
      p.draw = () => {
        p.background(20, 20, 30, 20);
        
        // Update and display all particles
        particles.forEach(particle => {
          particle.update();
          particle.display();
        });
      };
      
      // Handle window resizing
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };
    
    // Create the p5 instance
    p5Instance = new p5(sketch, sketchRef.current);
    
    // Cleanup function
    return () => {
      p5Instance.remove();
    };
  }, []);
  
  return <div ref={sketchRef} className="absolute inset-0 -z-10" />;
};

export default P5Sketch;
